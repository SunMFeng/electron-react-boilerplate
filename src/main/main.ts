/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import reLoader from 'electron-reloader';
import { program } from 'commander';
import { resolveHtmlPath } from './util';
import { MessageType } from './messagetype';
import { Message } from './message';
import {
  ExtraArgument,
  LocatorStoreTokenOptions,
  SaveLocatorArgument,
} from './parameters/ExtraArgument';
import { Locator } from './messageContent/Locator';

const { spawn } = require('child_process');
const fs = require('fs');
const process = require('process');

let recordProcess = null;

const extraArgument: ExtraArgument = {
  projectPath: '/home/smf/Documents/test',
  dotnetProgramPath: '',
  locatorChain: '',
};

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const startSubProcess = () => {
  let cpaturePath =
    '/home/smf/Desktop/newcode/RPACore/Capturer/Capturer.Linux/bin/Debug/net7.0/Capturer.Linux';
  if (!isDebug) {
    cpaturePath = `${extraArgument.dotnetProgramPath}/Capturer.Linux`;
  }
  recordProcess = spawn(cpaturePath, ['capture', '-f', 'selector.json'], {
    maxBuffer: 1024 * 1024 * 20,
    detached: true,
  });
  console.log('recordProcess id:', recordProcess.pid);
  recordProcess.stdout.on('data', (data: any) => {
    console.log('length of data:', data.length);

    let str = data.toString();
    if (str.startsWith('#CC-Locator-Complete#')) {
      str = str.substring(21);
      // eslint-disable-next-line no-use-before-define
      sendLocatorMessageToRenderProcess(str);
    } else {
      console.log('ignore msg:', data.toString());
    }
  });

  recordProcess!.on('close', (code: unknown) => {
    console.log('子进程退出：', code);
    // restart the process
    if (code) {
      recordProcess = startSubProcess();
      console.log('已经重启子进程.');
    }
  });
};

const sendLocatorMessageToRenderProcess = (str: string) => {
  const obj = JSON.parse(str);
  const tempScreenshotFile = obj.screenShot;
  console.log('tempScreenshotFile', tempScreenshotFile);
  let base64String = '';

  base64String = imageToBase64(tempScreenshotFile);
  const locator: Locator = {
    locator: obj.locator,
    screenshot: base64String,
  };
  const msg: Message = {
    messageType: MessageType.NewLocator,
    messageContent: locator,
  };
  // eslint-disable-next-line no-use-before-define
  sendMsgToRenderProcess(msg);
};

const imageToBase64 = (path: any) => {
  const data = fs.readFileSync(path);
  let base64String = Buffer.from(data).toString('base64');
  // base64String = `data:image/jpeg;base64,${base64String}`;
  return base64String;
};

const sendMsgToRenderProcess = (msg: Message) => {
  // eslint-disable-next-line no-use-before-define
  mainWindow?.webContents.send('ipc-example', msg);
};
let processArgs;

if (process.argv[1] === 'start') {
  program
    .command('start')
    .option('-p, --path <string>', 'the project path.')
    .option('-t, --type <string>', 'the record type.')
    .option('-e, --execpath <string>', 'the dotnet program path.')
    .option('-dsid, --defaultstoreid <string>', 'the default store id.')
    .action((options, command) => {
      console.log(options);
      processArgs = options;
    })
    .parse(process.argv);
} else if (process.argv[1] === 'verify') {
  program
    .command('verify')
    .option('-s, --selector <string>', 'the selector to be verified.')
    .option('-e, --execpath <string>', 'the dotnet program path.')
    .action((options, command) => {
      processArgs = options;
    })
    .parse(process.argv);
}
extraArgument.projectPath = processArgs.path;
extraArgument.dotnetProgramPath = processArgs.execpath;
console.log('project path:', extraArgument.projectPath);
console.log('dotnet program path:', extraArgument.dotnetProgramPath);

startSubProcess();

// -----net core 7 -------------------------------------------------------
let baseNetAppPath;
if (isDebug) {
  baseNetAppPath =
    '/home/smf/Desktop/newcode/RPACore/Capturer/Capturer.Linux/bin/Debug/net7.0';
  extraArgument.projectPath = '/home/smf/Documents/test';
} else {
  baseNetAppPath = extraArgument.dotnetProgramPath;
}

const edge = require('electron-edge-js');

const baseDll = `${baseNetAppPath}/Clicknium.LocatorStore.dll`;

console.log('dotnet dll path:', baseDll);
const localTypeName = 'Clicknium.LocatorStore.LocatorStoreOperate';

const initLocatorStore = edge.func({
  assemblyFile: baseDll,
  typeName: localTypeName,
  methodName: 'InitLocatorStore',
});

const saveLocatorStore = edge.func({
  assemblyFile: baseDll,
  typeName: localTypeName,
  methodName: 'SaveChanges',
});

reLoader(module);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  if (arg instanceof Object) {
    const msg = arg as Message;
    // eslint-disable-next-line no-use-before-define
    messageHandler(msg);
  }
});

const messageHandler = (msg: Message) => {
  switch (msg?.messageType) {
    case MessageType.ChangeWindowSize:
      console.log('receive ChangeWindowSize message from render:', msg);
      mainWindow?.setResizable(true);
      mainWindow?.setSize(
        msg.messageContent.width,
        msg.messageContent.height,
        true
      );
      mainWindow?.setResizable(false);
      break;
    case MessageType.SaveLocatorStore:
      console.log('receive SaveLocatorStore message from render:', msg);
      // eslint-disable-next-line no-use-before-define
      saveLocatorStoreToFile(msg.messageContent);
      process.kill(recordProcess.pid, 'SIGTERM');
      app.quit();
      break;
    case MessageType.Cancel:
      console.log('receive Cancel message from render:', msg);
      process.kill(recordProcess.pid, 'SIGTERM');
      app.quit();
      break;
    default:
      break;
  }
};
const saveLocatorStoreToFile = (content: any) => {
  // saveLocatorStore()
  const locatorArgs: SaveLocatorArgument = {
    projectPath: extraArgument.projectPath,
    input: content,
  };

  saveLocatorStore(JSON.stringify(locatorArgs), (error: any, result: any) => {
    if (error) throw error;
    console.log('savechanges result:', result);
  });
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  // if (isDebug) {
  //   await installExtensions();
  // }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 330,
    height: 646,
    frame: false,
    resizable: false,
    icon: getAssetPath('logo.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    alwaysOnTop: true,
    // skipTaskbar: true,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.setTitle('Clicknium Recorder');
      mainWindow.show();

      initLocatorStore(
        JSON.stringify(extraArgument),
        (error: any, result: any) => {
          if (error) throw error;
          // console.log('initLocatorStore result:', result);
          const msg: Message = {
            messageType: MessageType.LocatorStoreTree,
            messageContent: result,
          };
          sendMsgToRenderProcess(msg);
        }
      );
    }
  });

  mainWindow.on('closed', () => {
    // process.kill(recordProcess.pid, 'SIGTERM');
    app.quit();
    mainWindow = null;
  });

  const template1 = [
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template1);
  Menu.setApplicationMenu(null);
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
