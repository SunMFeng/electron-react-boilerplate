import { create } from 'zustand';

export interface ModeSwitcherStoreState {
  smartMode: boolean;
  setSmartMode: (smartMode: boolean) => void;
  selectorPanelExpanded: boolean;
  setSelectorPanelExpanded: (smartMode: boolean) => void;
}

export const useModeSwitcherStore = create<ModeSwitcherStoreState>((set) => ({
  smartMode: false,
  selectorPanelExpanded: false,
  setSmartMode: (smartMode: boolean) => {
    set({ smartMode });
  },
  setSelectorPanelExpanded: (selectorPanelExpanded: boolean) => {
    set({ selectorPanelExpanded });
  },
}));
