import { SelectorStoreHttpClient } from '@/api/SelectorStoreHttpClient';

export class SelectorStoreHttpService {
  private static _selectorStore: SelectorStoreHttpClient;

  public static get selectorStore() {
    if (this._selectorStore) {
      return this._selectorStore;
    }

    this._selectorStore = new SelectorStoreHttpClient();
    return this._selectorStore;
  }
}
