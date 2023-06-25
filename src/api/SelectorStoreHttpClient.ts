// import { SelectorStore } from "@/models/SelectorStore";
import { SelectorStore } from '@/models/SelectorStore';
import { HttpClient } from './shared';

export const selectors: SelectorStore[] = [
  {
    key: 1,
    storeName: 'Store A',
    selectors: [
      {
        key: 2,
        selectorName: 'Baidu_Input',
      },
      {
        key: 3,
        selectorName: 'submit_su',
      },
    ],
    folders: [
      {
        key: 4,
        folderName: 'Folder A.4',
        selectors: [
          {
            key: 5,
            selectorName: 'Google_c',
          },
        ],
      },
      {
        key: 6,
        folderName: 'Folder A.6',
        folders: [
          {
            key: 7,
            folderName: 'Folder A.6.7',
            selectors: [
              {
                key: 8,
                selectorName: 'Yahoo_IMG',
              },
              {
                key: 9,
                selectorName: 'Bing_Search',
              },
            ],
          },
          {
            key: 10,
            folderName: 'Folder A.6.10',
            selectors: [
              {
                key: 11,
                selectorName: 'Google_a',
              },
            ],
            folders: [
              {
                key: 12,
                folderName: 'Folder A.6.10.12',
                selectors: [
                  {
                    key: 13,
                    selectorName: 'Google_b',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 14,
    storeName: 'Store B',
    selectors: [
      {
        key: 15,
        selectorName: 'Google_Title',
      },
    ],
  },
];

export class SelectorStoreHttpClient extends HttpClient {
  public async getSelectors() {
    // const { data } = await this.request<{ data: SelectorStore[] }>({
    //   method: 'GET',
    //   url: `/selectors`,
    // });
    // data.data = selectors;
    // return data.data;
    console.log(this);
    return selectors; // todo: mock
  }
}
