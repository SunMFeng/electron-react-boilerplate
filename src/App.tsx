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
      app.style.width = smartMode && selectorPanelExpanded ? '654px' : '327px';
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
