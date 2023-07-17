import { StepItem } from '@/models/StepList';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type State = {
  // todos: Record<string, Todo>
  stepItems: StepItem[];
  currSelectedItem: (StepItem & { index?: number }) | null;
};

type Actions = {
  setStepItems: (stepItems: StepItem[]) => void;
  addStep: (item: StepItem) => void;
  setStepItemByIndex: (payload: { index: number; item: StepItem }) => void;
  setCurrSelectedItem: (item: StepItem & { index: number }) => void;
};

export const useSmartStepListStore = create(
  immer<State & Actions>((set, get) => ({
    // stepItems: [
    //   {
    //     type: 'click',
    //     folderName: 'Baidu',
    //     targetSelector: 'submit_su1',
    //   },
    //   {
    //     type: 'click',
    //     folderName: 'Store A',
    //     targetSelector: 'submit_su2',
    //   },
    //   {
    //     type: 'input',
    //     targetSelector: 'Google_Title',
    //     variable: 'json_1',
    //   },
    //   {
    //     type: 'input',
    //     targetSelector: 'Baidu_Input',
    //     variable: 'json_2',
    //   },
    //   {
    //     type: 'input',
    //     targetSelector: 'Yahoo_IMG',
    //     variable: 'json_3',
    //   },
    //   {
    //     type: 'input',
    //     targetSelector: 'Bing_Search',
    //     variable: 'json_4',
    //   },
    //   {
    //     type: 'input',
    //     targetSelector: 'Google_a',
    //     variable: 'json_5',
    //   },
    //   {
    //     type: 'input',
    //     targetSelector: 'Google_b',
    //     variable: 'json_6',
    //   },
    //   {
    //     type: 'input',
    //     targetSelector: 'Google_c',
    //     variable: 'json_7',
    //   },
    // ],
    stepItems: [],
    currSelectedItem: null,
    setStepItems: (stepItems: StepItem[]) => {
      set({ stepItems });
    },
    addStep: (item: StepItem) => {
      set((state) => {
        state.stepItems.push(item);
        const idx = state.stepItems.length - 1;
        get().setCurrSelectedItem({ index: idx, ...state.stepItems[idx] });
      });
    },
    setStepItemByIndex: (payload: { index: number; item: StepItem }) =>
      set((state) => {
        state.stepItems[payload.index] = payload.item;
      }),
    setCurrSelectedItem: (item: StepItem & { index: number }) => {
      set({ currSelectedItem: item });
    },
  }))
);
