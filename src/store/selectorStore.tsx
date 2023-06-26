import {
  Selector,
  SelectorStore,
  SelectorStoreFolder,
} from '@/models/SelectorStore';
import { SelectorStoreHttpService } from '@/service/SelectorStoreHttpService';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SelectorStoreState {
  selectors: SelectorStore[];
}
export interface SelectorStoreAction {
  getSelectors: () => Promise<SelectorStore[] | undefined>;
  setSelectors: (selectors: SelectorStore[]) => void;
  setSelectorByIndex: (payload: { index: number; item: SelectorStore }) => void;
  deleteByIndex: (index: string) => void;
}

export const useSelectorStore = create(
  immer<SelectorStoreState & SelectorStoreAction>((set) => ({
    selectors: [],
    setSelectors: (selectors: SelectorStore[]) => {
      set({ selectors });
    },
    setSelectorByIndex: (payload: { index: number; item: SelectorStore }) => {
      set((state) => {
        state.selectors[payload.index] = payload.item;
      });
    },
    deleteByIndex: (index: string) => {
      function removeKeyFromSelectors(
        selectorsArray: Selector[],
        key: string,
        found: boolean
      ) {
        let _found = found;
        const updatedSelectors = selectorsArray.reduce(
          (arr: Selector[], selector) => {
            if (!found && selector.key.toString() !== key) {
              arr.push(selector);
            } else if (!found && selector.key.toString() === key) {
              _found = true;
            }
            return arr;
          },
          []
        );
        return { selectors: updatedSelectors, found: _found };
      }

      function removeKeyFromFolderArray(
        folderArray: SelectorStoreFolder[],
        key: string,
        found: boolean
      ) {
        const updatedFolders = folderArray.reduce(
          (arr: SelectorStoreFolder[], folder) => {
            if (folder.key.toString() !== key) {
              arr.push(folder);
            } else if (!found && folder.key.toString() === key) {
              // eslint-disable-next-line no-param-reassign
              found = true;
            }

            if (!found && folder.selectors) {
              // eslint-disable-next-line no-param-reassign
              ({ selectors: folder.selectors, found } = removeKeyFromSelectors(
                folder.selectors,
                key,
                found
              ));
            }
            if (!found && folder.folders) {
              // eslint-disable-next-line no-param-reassign
              ({ folders: folder.folders, found } = removeKeyFromFolderArray(
                folder.folders,
                key,
                found
              ));
            }

            return arr;
          },
          []
        );
        return { folders: updatedFolders, found };
      }

      function removeFirstKey(
        selectorStoreArray: SelectorStore[],
        key: string
      ) {
        let newArray: SelectorStore[] = JSON.parse(
          JSON.stringify(selectorStoreArray)
        );
        let found = false; // 用于跟踪是否已找到key并删除元素

        for (let i = 0; i < newArray.length; i += 1) {
          if (found === false && newArray[i].key?.toString() === key) {
            found = true;
            newArray.splice(i, 1);
          }
        }

        if (found === false) {
          newArray = newArray.map((store) => {
            if (!found) {
              if (store.selectors) {
                ({ selectors: store.selectors, found } = removeKeyFromSelectors(
                  store.selectors,
                  key,
                  found
                ));
              }

              if (store.folders) {
                ({ folders: store.folders, found } = removeKeyFromFolderArray(
                  store.folders,
                  key,
                  found
                ));
              }
            }
            return store;
          });
        }
        return newArray;
      }

      if (index) {
        set((state) => {
          const newSelectors = removeFirstKey(state.selectors, index);
          state.selectors = newSelectors;
        });
      }
    },
    getSelectors: async () => {
      try {
        const mySelectors =
          await SelectorStoreHttpService.selectorStore.getSelectors();
        const res = mySelectors || [];
        set({ selectors: res });
        return res;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
      return [];
    },
  }))
);
