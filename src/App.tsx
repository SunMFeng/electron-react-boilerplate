import React, { useCallback, useEffect } from 'react';
// import React from 'react';
import './App.css';
import '@/styles/index.css';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { Layout } from './pages/components/Layout';
import { useSelectorStore } from './store/selectorStore';
import { MessageType } from './main/messagetype';
import { SelectorStore } from './models/SelectorStore';
import { useSmartStepListStore } from './store/smartMode/stepList';
import { useSelectorTree } from './store/selectorTree';

function App() {
  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  const setSelectors = useSelectorStore((state) => state.setSelectors);
  const addNewSelector = useSelectorStore((state) => state.addNewSelector);
  const addStep = useSmartStepListStore((state) => state.addStep);
  const setSelectedKeys = useSelectorTree((state) => state.setSelectedKeys);
  const setExpandKeys = useSelectorTree((state) => state.setExpandKeys);
  // state.currActiveContainer?.key.toString()
  const currActiveContainer = useSelectorStore(
    (state) => state.setCurrActiveContainer
  );

  const handleMessageNewLocator = useCallback(
    (_arg: unknown) => {
      const arg = _arg as { messageContent: any; messageType: MessageType };

      if (arg.messageType === MessageType.NewLocator) {
        const callbackRes = addNewSelector(arg.messageContent);
        if (callbackRes.returnKey) {
          setSelectedKeys([callbackRes.returnKey]);
          if (callbackRes.parentKey) {
            setExpandKeys([callbackRes.parentKey]);
            currActiveContainer({
              key: callbackRes.parentKey,
              name: callbackRes.parentName ?? '',
            });
          }

          if (smartMode) {
            addStep({
              type: 'click',
              folderName: callbackRes.parentName ?? ``,
              folderNameKey: callbackRes.parentKey ?? '',
              targetSelector: callbackRes.returnName ?? '',
              targetSelectorKey: callbackRes.returnKey ?? ``,
              locator: arg.messageContent.locator,
              screenshot: arg.messageContent.screenshot,
            });
          }
        }

        console.log('init effect: added new selector');
      }
    },
    [
      addNewSelector,
      addStep,
      currActiveContainer,
      setExpandKeys,
      setSelectedKeys,
      smartMode,
    ]
  );

  const handleMessageLocatorStoreTree = useCallback(
    (_arg: unknown) => {
      const arg = _arg as { messageContent: any; messageType: MessageType };

      if (arg.messageType === MessageType.LocatorStoreTree) {
        let mySelectors: SelectorStore[] = [];
        mySelectors = JSON.parse(arg.messageContent);

        const res = mySelectors;
        setSelectors(res);
        console.log('init effect: set tree struc', { res });
      }
    },
    [setSelectors]
  );

  // 根据message处理selectors初始化&存储
  useEffect(() => {
    window.electron.ipcRenderer.once(
      'ipc-example',
      handleMessageLocatorStoreTree
    );
    // return () => {
    //   window.electron.ipcRenderer?.removeAllListeners?.('ipc-example');
    // };
  }, [handleMessageLocatorStoreTree]);

  useEffect(() => {
    window.electron.ipcRenderer.on('ipc-example', handleMessageNewLocator);
    return () => {
      window.electron.ipcRenderer?.removeAllListeners?.('ipc-example');
    };
  }, [handleMessageNewLocator]);

  return (
    <div className="App">
      <Layout />
    </div>
  );
}

export default App;
