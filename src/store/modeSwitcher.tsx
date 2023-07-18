import { create } from 'zustand';

export interface ModeSwitcherStoreState {
  smartMode: boolean;
  setSmartMode: (smartMode: boolean) => boolean;
  selectorPanelExpanded: boolean;
  setSelectorPanelExpanded: (smartMode: boolean) => boolean;
}

export const useModeSwitcherStore = create<ModeSwitcherStoreState>((set) => ({
  smartMode: false,
  selectorPanelExpanded: false,
  setSmartMode: (smartMode: boolean) => {
    set({ smartMode });
    return smartMode;
  },
  setSelectorPanelExpanded: (selectorPanelExpanded: boolean) => {
    set({ selectorPanelExpanded });
    return selectorPanelExpanded;
  },
}));
