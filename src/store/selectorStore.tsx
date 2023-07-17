import {
  Selector,
  SelectorStore,
  SelectorStoreFolder,
} from '@/models/SelectorStore';
import type { DataNode, EventDataNode } from 'antd/es/tree';
import { SelectorStoreHttpService } from '@/service/SelectorStoreHttpService';
import { produce } from 'immer';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { guid } from '@/utils/guid';
import { Locator } from '@/main/messageContent/Locator';

export type DropDownMenuAction = 'rename' | 'recapture' | undefined;

export interface SelectorStoreState {
  selectors: SelectorStore[];
  currActiveContainer: { key: string; name: string } | undefined;
  currRightClickingItem: EventDataNode<DataNode> | undefined;
  currDropDownMenuAction: DropDownMenuAction;
}
export interface SelectorStoreAction {
  getSelectors: () => Promise<SelectorStore[] | undefined>;
  setSelectors: (selectors: SelectorStore[]) => void;
  setCurrActiveContainer: (
    container: { key: string; name: string } | undefined
  ) => void;
  setCurrRightClickingItem: (item: EventDataNode<DataNode> | undefined) => void;
  setCurrDropDownMenuAction: (action: DropDownMenuAction) => void;
  setNameByIndex: (payload: { index: string; name: string }) => void;
  createStore: () => void;
  createNewFolder: () => string | null;
  addNewSelector: (messageContent: Locator) => {
    returnKey: string | null;
    returnName: string | null;
    parentKey: string | null;
    parentName: string | null;
  };
  deleteByIndex: (index: string) => void;
}

export const useSelectorStore = create(
  immer<SelectorStoreState & SelectorStoreAction>((set) => ({
    selectors: [],
    currActiveContainer: undefined,
    currRightClickingItem: undefined,
    currDropDownMenuAction: undefined,
    setSelectors: (selectors: SelectorStore[]) => {
      set({ selectors });
    },
    setCurrActiveContainer: (
      container: { key: string; name: string } | undefined
    ) => {
      set({ currActiveContainer: container });
    },
    setCurrRightClickingItem: (item: EventDataNode<DataNode> | undefined) => {
      set({ currRightClickingItem: item });
    },
    setCurrDropDownMenuAction: (action: DropDownMenuAction) => {
      set({ currDropDownMenuAction: action });
    },
    setNameByIndex: (payload: { index: string; name: string }) => {
      const { index, name } = payload;
      function updateNodeByKey(
        selectors: SelectorStore[],
        key: string,
        callback: (node: Selector | SelectorStoreFolder | SelectorStore) => void
      ) {
        return produce(selectors, (draft) => {
          const findNode = (
            node: Selector | SelectorStoreFolder | SelectorStore
          ) => {
            if (node.key === key) {
              callback(node);
            } else {
              if ('selectors' in node) {
                if (node.selectors && Array.isArray(node.selectors)) {
                  node.selectors.forEach((selector: Selector) => {
                    if (selector.key === key) {
                      callback(selector);
                    }
                  });
                }
              }
              if ('folders' in node) {
                if (node.folders && Array.isArray(node.folders)) {
                  node.folders.forEach((folder: SelectorStoreFolder) => {
                    findNode(folder);
                  });
                }
              }
            }
          };

          draft.forEach((store) => {
            findNode(store);
          });
        });
      }

      set((state) => {
        // state.selectors[payload.index] = payload.item;
        const updatedSelectors = updateNodeByKey(
          state.selectors,
          index,
          (node) => {
            if ('folderName' in node) {
              node.folderName = name;
            } else if ('selectorName' in node) {
              node.selectorName = name;
            } else if ('storeName' in node) {
              node.storeName = name;
            }
          }
        );

        state.selectors = updatedSelectors;
      });
    },
    createStore: () => {
      const uuid = guid();
      set((state) => {
        state.selectors.push({
          key: uuid,
          storeName: `New Store-${uuid}`,
        });
      });
    },
    createNewFolder: () => {
      let returnKey = null;
      function updateNodeByKey(
        selectors: SelectorStore[],
        key: string,
        callback: (node: Selector | SelectorStoreFolder | SelectorStore) => void
      ) {
        return produce(selectors, (draft) => {
          const findNode = (
            node: Selector | SelectorStoreFolder | SelectorStore
          ) => {
            if (node.key === key) {
              callback(node);
            } else {
              if ('selectors' in node) {
                if (node.selectors && Array.isArray(node.selectors)) {
                  node.selectors.forEach((selector: Selector) => {
                    if (selector.key === key) {
                      callback(selector);
                    }
                  });
                }
              }
              if ('folders' in node) {
                if (node.folders && Array.isArray(node.folders)) {
                  node.folders.forEach((folder: SelectorStoreFolder) => {
                    findNode(folder);
                  });
                }
              }
            }
          };

          draft.forEach((store) => {
            findNode(store);
          });
        });
      }

      set((state) => {
        // state.selectors[payload.index] = payload.item;
        const updatedSelectors = state.currRightClickingItem?.key.toString()
          ? updateNodeByKey(
              state.selectors,
              state.currRightClickingItem?.key.toString(),
              (node) => {
                const uuid = guid();
                if ('folderName' in node) {
                  if (node?.folders) {
                    node?.folders?.push({
                      key: uuid,
                      folderName: `New Folder-${uuid}`,
                    });
                  } else {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    node!.folders = [
                      {
                        key: uuid,
                        folderName: `New Folder-${uuid}`,
                      },
                    ];
                  }
                  returnKey = uuid;
                } else if ('storeName' in node) {
                  if (node?.folders) {
                    node?.folders?.push({
                      key: uuid,
                      folderName: `New Folder-${uuid}`,
                    });
                  } else {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    node!.folders = [
                      {
                        key: uuid,
                        folderName: `New Folder-${uuid}`,
                      },
                    ];
                  }
                  returnKey = uuid;
                }
              }
            )
          : state.selectors;

        state.selectors = updatedSelectors;
      });
      return returnKey;
    },
    addNewSelector: (messageContent: Locator) => {
      let returnKey = null;
      let returnName = null;
      let parentName = null;
      let parentKey = null;
      function updateNodeByKey(
        selectors: SelectorStore[],
        key: string,
        callback: (node: SelectorStoreFolder | SelectorStore) => void
      ) {
        return produce(selectors, (draft) => {
          const findNode = (node: SelectorStoreFolder | SelectorStore) => {
            if (node.key === key) {
              callback(node);
            } else if (node.folders && Array.isArray(node.folders)) {
              node.folders.forEach((folder: SelectorStoreFolder) => {
                findNode(folder);
              });
            }
          };

          draft.forEach((store) => {
            findNode(store);
          });
        });
      }

      set((state) => {
        // state.selectors[payload.index] = payload.item;
        const updatedSelectors = updateNodeByKey(
          state.selectors,
          state.currActiveContainer?.key.toString() ?? state.selectors[0].key,
          (node) => {
            const uuid = guid();
            if (node.selectors) {
              node?.selectors?.push({
                key: uuid,
                locatorType: 1,
                selectorName: `New Selector-${uuid}`,
                targetSelector: messageContent.locator,
                metaData: '',
                base64ScreenShot: messageContent?.screenshot ?? '',
              });
            } else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              node!.selectors = [
                {
                  key: uuid,
                  locatorType: 1,
                  selectorName: `New Selector-${uuid}`,
                  targetSelector: messageContent.locator,
                  metaData: '',
                  base64ScreenShot: messageContent?.screenshot ?? '',
                },
              ];
            }

            returnKey = uuid;
            returnName = `New Selector-${uuid}`;
            parentKey = node.key;
            if ('storeName' in node) {
              parentName = node.storeName;
            } else if ('folderName' in node) {
              parentName = node.folderName;
            }
          }
        );

        state.selectors = updatedSelectors;
      });
      return { returnKey, returnName, parentKey, parentName };
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
