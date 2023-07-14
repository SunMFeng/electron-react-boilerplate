import React, { useEffect } from 'react';
import './App.css';
import '@/styles/index.css';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { Layout } from './pages/components/Layout';

function App() {
  const selectorPanelExpanded = useModeSwitcherStore(
    (state) => state.selectorPanelExpanded
  );
  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  useEffect(() => {
    const app = document.querySelector('.App') as HTMLDivElement;
    const setAppWidth = () => {
      if (smartMode && selectorPanelExpanded) {
        app.style.width = '654px';
        window.electron.ipcRenderer.sendMessage('ipc-example', {
          messageType: 0,
          messageContent: {
            width: 666,
            height: 690,
          },
        });
      } else {
        app.style.width = '327px';
        window.electron.ipcRenderer.sendMessage('ipc-example', {
          messageType: 0,
          messageContent: {
            height: 690,
            width: 339,
          },
        });
      }
    };
    if (app) {
      setAppWidth();
    }
  }, [selectorPanelExpanded, smartMode]);

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
