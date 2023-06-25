import { SelectorStore } from '@/models/SelectorStore';
import { SelectorStoreHttpService } from '@/service/SelectorStoreHttpService';
import { create } from 'zustand';

export interface SelectorStoreState {
  selectors: SelectorStore[];
  setSelectors: (selectors: SelectorStore[]) => void;
}
export interface SelectorStoreAction {
  getSelectors: () => Promise<SelectorStore[] | undefined>;
}

export const useSelectorStore = create<
  SelectorStoreState & SelectorStoreAction
>((set, get) => ({
  selectors: [],
  setSelectors: (selectors: SelectorStore[]) => {
    set({ selectors });
  },
  getSelectors: async () => {
    try {
      const _selectors =
        await SelectorStoreHttpService.selectorStore.getSelectors();
      const res = _selectors || [];
      set({ selectors: res });
      return res;
    } catch (error) {
      console.log(error);
    }
  },
}));
