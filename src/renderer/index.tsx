import App from '@/App';
import { createRoot } from 'react-dom/client';
// import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// // calling IPC exposed from preload script
// window.electron.ipcRenderer.on('ipc-example', (arg) => {
//   console.log(arg);
//   if (!window.locator) {
//     window.locator = arg;
//   }
// });
