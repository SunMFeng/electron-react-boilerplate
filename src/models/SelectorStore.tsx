export interface Selector {
  key: string;
  locatorType?: 'image' | 'ui';
  selectorName: string;
  targetSelector?: unknown;
}

export interface SelectorStoreFolder {
  key: string;
  folderName: string;
  folders?: SelectorStoreFolder[];
  selectors?: Selector[];
}

export interface SelectorStore {
  key: string;
  storeName: string;
  selectors?: Selector[];
  folders?: SelectorStoreFolder[];
}
