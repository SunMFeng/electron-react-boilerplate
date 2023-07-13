export interface LocatorStoreTokenOptions {
  token: string;
  spaceId: string;
  storeId: string;
  storeName: string;
}

export interface ExtraArgument {
  projectPath: string;
  locatorChain: string;
  defaultStoreId?: LocatorStoreTokenOptions;
}
