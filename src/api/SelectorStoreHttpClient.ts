// import { SelectorStore } from "@/models/SelectorStore";
import { SelectorStore } from '@/models/SelectorStore';
import { HttpClient } from './shared';

export const selectors: SelectorStore[] = [
  {
    key: 'aaaaaaaaaa',
    storeName: 'Store A',
    selectors: [
      {
        key: '2',
        selectorName: 'Baidu_Input',
      },
      {
        key: '3',
        selectorName: 'submit_su1',
      },
      {
        key: '311',
        selectorName: 'submit_su2',
      },
      {
        key: '3at',
        selectorName: 'submit_su3',
      },
      {
        key: '1346',
        selectorName: 'submit_su4',
      },
    ],
    folders: [
      {
        key: 'c4',
        folderName: 'Folder A.4',
        selectors: [
          {
            key: '2d5',
            selectorName: 'Google_c',
          },
        ],
      },
      {
        key: '55',
        folderName: 'Folder A.6',
        folders: [
          {
            key: '7',
            folderName: 'Folder A.6.7',
            selectors: [
              {
                key: 'xx',
                selectorName: 'Yahoo_IMG',
              },
              {
                key: '9',
                selectorName: 'Bing_Search',
              },
            ],
          },
          {
            key: '10',
            folderName: 'Folder A.6.10',
            selectors: [
              {
                key: '11',
                selectorName: 'Google_a',
              },
            ],
            folders: [
              {
                key: 'a',
                folderName: 'Folder A.6.10.12',
                selectors: [
                  {
                    key: 'c-aw',
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
    key: 'bbc',
    storeName: 'Store B',
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
