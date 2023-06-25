export interface Selector {
  key: number;
  locatorType?: 'image' | 'ui';
  selectorName: string;
  targetSelector?: any;
}

export interface SelectorStoreFolder {
  key: number;
  folderName: string;
  folders?: SelectorStoreFolder[];
  selectors?: Selector[];
}

export interface SelectorStore {
  key: number;
  storeName: string;
  selectors?: Selector[];
  folders?: SelectorStoreFolder[];
}
