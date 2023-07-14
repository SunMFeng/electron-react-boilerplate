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
import { resolveHtmlPath } from './util';
import { MessageType } from './messagetype';
import { Message } from './message';
import {
  ExtraArgument,
  LocatorStoreTokenOptions,
  SaveLocatorArgument,
} from './parameters/ExtraArgument';
import { Locator } from './messageContent/Locator';

const { exec } = require('child_process');
const fs = require('fs');

const dicRecordProcessMsg: Record<string, string[]> = {};
let recordProcess = null;

const startSubProcess = () => {
  recordProcess = exec(
    '/home/smf/Desktop/code/cc-linux/Capturer/Capturer.Linux/bin/Debug/net7.0/Capturer.Linux capture -f selector.json',
    { maxBuffer: 1024 * 1024 * 20 }
  );

  recordProcess.stdout.on('data', (data: any) => {
    console.log('length of data:', data.length);

    let str = data.toString();
    if (str.startsWith('#CC-Locator-Complete#')) {
      str = str.substring(21);
      // eslint-disable-next-line no-use-before-define
      sendLocatorMessageToRenderProcess(str);
    } else if (str.startsWith('#CC-Locator-Partial')) {
      // write complete tag to tmp file.
      // eslint-disable-next-line no-use-before-define
      writeOutputStreamReadDoneTag();
      // eslint-disable-next-line no-use-before-define
      const key = getPartialMsgKey(str);
      console.log('key is:', key);
      // eslint-disable-next-line no-use-before-define
      const value = getPartialMsgContent(str);
      console.log('isEnd is:', value.isEnd);
      // eslint-disable-next-line no-prototype-builtins
      if (!dicRecordProcessMsg[key]) {
        dicRecordProcessMsg[key] = [value.result];
      } else {
        dicRecordProcessMsg[key].push(value.result);
      }
      if (value.isEnd) {
        const result = dicRecordProcessMsg[key].join('');
        // eslint-disable-next-line no-use-before-define
        sendLocatorMessageToRenderProcess(result);
        dicRecordProcessMsg[key] = [];
      }
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

startSubProcess();

const writeOutputStreamReadDoneTag = () => {
  const filePath = '/tmp/sharedfile00100.sf';
  const data = 'Parent Done.';
  fs.writeFile(filePath, data, (err: any) => {
    console.log('write file error.', err);
  });
};
const sendLocatorMessageToRenderProcess = (str: string) => {
  const obj = JSON.parse(str);
  const locator: Locator = {
    locator: obj.locator,
    screenshot: obj.screenShot,
  };
  const msg: Message = {
    messageType: MessageType.NewLocator,
    messageContent: locator,
  };
  // eslint-disable-next-line no-use-before-define
  sendMsgToRenderProcess(msg);
};

const getPartialMsgKey = (str: any) => {
  return str.substring(20, 52);
};

const getPartialMsgContent = (str: string) => {
  let result = '';
  let isEnd = false;
  if (str.endsWith('#CC-Locator-Partial-End#')) {
    const excludeHeader = str.substring(53);
    // console.log('excludeHeader is:', excludeHeader);
    result = excludeHeader.slice(0, -56);
    // console.log('result is:', result);
    isEnd = true;
  } else {
    const excludeHeader = str.substring(53);
    // console.log('excludeHeader is:', excludeHeader);
    result = excludeHeader;
  }
  return { isEnd, result };
};

const sendMsgToRenderProcess = (msg: Message) => {
  // eslint-disable-next-line no-use-before-define
  mainWindow?.webContents.send('ipc-example', msg);
};

// -----net core 7 -------------------------------------------------------
const baseNetAppPath =
  '/home/smf/Desktop/code/cc-linux/Capturer/Capturer.Linux/bin/Debug/net7.0';

const edge = require('electron-edge-js');

const baseDll = `${baseNetAppPath}/Clicknium.LocatorStore.dll`;

console.log('baseDll1', baseDll);
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

const extraArgument: ExtraArgument = {
  projectPath: '/home/smf/Documents/test',
  locatorChain: '',
};

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
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  // event.reply('ipc-example', msgTemplate('pong'));

  if (arg === 'start') {
    console.log('get start msg');
  } else if (arg === 'stop') {
    console.log('get stop msg');
  } else if (arg instanceof Object) {
    const msg = arg as Message;
    // eslint-disable-next-line no-use-before-define
    messageHandler(msg);
  }
});

const messageHandler = (msg: Message) => {
  switch (msg?.messageType) {
    case MessageType.ChangeWindowSize:
      console.log('receive ChangeWindowSize message from render:', msg);
      mainWindow?.setSize(
        msg.messageContent.width,
        msg.messageContent.height,
        true
      );
      break;
    case MessageType.SaveLocatorStore:
      console.log('receive SaveLocatorStore message from render:', msg);
      // eslint-disable-next-line no-use-before-define
      saveLocatorStoreToFile(msg.messageContent);
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

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

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
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
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
  Menu.setApplicationMenu(menu);
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
