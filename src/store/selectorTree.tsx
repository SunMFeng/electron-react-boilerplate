import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { Key } from 'rc-tree/lib/interface';

export interface SelectorTreeState {
  selectedKeys: Key[];
  expandKeys: Key[];
}

export interface SelectorTreeAction {
  setSelectedKeys: (selectedKeys: Key[]) => void;
  setExpandKeys: (expandKeys: Key[]) => void;
}

export const useSelectorTree = create(
  immer<SelectorTreeState & SelectorTreeAction>((set) => ({
    selectedKeys: [],
    expandKeys: [],
    setSelectedKeys: (selectedKeys: Key[]) => {
      set({ selectedKeys });
    },
    setExpandKeys: (expandKeys: Key[]) => {
      set({ expandKeys });
    },
  }))
);
