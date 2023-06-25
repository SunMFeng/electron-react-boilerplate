import {
  AdvancedOptionType,
  CaptureTechnologyType,
} from '@/models/SettingSelectArea';
import { create } from 'zustand';

export interface SettingAreaStoreState {
  captureTechSelected: CaptureTechnologyType;
  setCaptureTechSelected: (captureTechSelected: CaptureTechnologyType) => void;
  advancedOptionSelected: AdvancedOptionType;
  setAdvancedOptionSelected: (
    advancedOptionSelected: AdvancedOptionType
  ) => void;
}

export const useSettingAreaStore = create<SettingAreaStoreState>((set) => ({
  captureTechSelected: 'AutoDetect',
  setCaptureTechSelected: (captureTechSelected: CaptureTechnologyType) => {
    set({ captureTechSelected });
  },
  advancedOptionSelected: '',
  setAdvancedOptionSelected: (advancedOptionSelected: AdvancedOptionType) => {
    set({ advancedOptionSelected });
  },
}));
