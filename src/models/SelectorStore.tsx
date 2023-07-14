export interface Selector {
  key: string;
  locatorType?: 'image' | 'ui' | 0 | 1;
  selectorName: string;
  targetSelector?: string;
  metaData?: string;
  base64ScreenShot?: string;
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
