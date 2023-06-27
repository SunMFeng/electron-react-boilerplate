/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, {
  KeyboardEventHandler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ReactComponent as IconMore } from '@/assets/imgs/icon-more-normalmode.svg';
import { ReactComponent as IconHelp } from '@/assets/imgs/icon-help.svg';
import { ReactComponent as IconCreatestore } from '@/assets/imgs/icon-createstore.svg';
import { ReactComponent as IconStore } from '@/assets/imgs/icon-store.svg';
import { ReactComponent as IconSelectorAddByClick } from '@/assets/imgs/icon-selector-addby-click.svg';
import { ReactComponent as IconFolder } from '@/assets/imgs/icon-folder.svg';
import type { DataNode, EventDataNode } from 'antd/es/tree';
import Tree from 'antd/es/tree';
import { uniqBy } from 'lodash-es';
import { useSmartStepListStore } from '@/store/smartMode/stepList';
import type { Key } from 'rc-tree/lib/interface';
import { SelectorStore, SelectorStoreFolder } from '@/models/SelectorStore';
import { useSelectorStore } from '@/store/selectorStore';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { Dropdown, MenuProps } from 'antd';
import Button from '../components/Button';
import SvgIcon from '../components/SvgIcon';

const { DirectoryTree } = Tree;

type DirectoryTreeProps = React.ComponentProps<typeof DirectoryTree>;
type EventProps = Pick<
  DirectoryTreeProps,
  'onSelect' | 'onRightClick' | 'onExpand'
>;
type SelectEvent = EventProps['onSelect'];
type ExpandEvent = EventProps['onExpand'];
type RightClickEvent = EventProps['onRightClick'];
type Defined<T> = Exclude<T, undefined>;
type MyDataNode = EventDataNode<DataNode>;

/**
 * @function useSelectorTreeData: 总结转化为自定义化;
 * @param selectors: api返回元数据(回显时 or etc.)
 * @returns treeNodes: 过滤后为antd组件可用的DataNode[]
 * @returns getSelectors: api请求selector列表
 */
export function useSelectorTreeData() {
  const selectors = useSelectorStore((state) => state.selectors);
  const getSelectors = useSelectorStore((state) => state.getSelectors);

  const [treeNodes, setTreeNodes] = useState<DataNode[]>([]);

  const getTitle = useCallback(
    (selector: SelectorStore | SelectorStoreFolder): React.ReactNode => {
      if ('storeName' in selector) {
        return (
          <div
            css={css`
              height: 20px;
              line-height: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <SvgIcon
              value={16}
              SvgComponent={IconStore}
              css={css`
                margin-right: 9px;
                fill: #ffffff;
              `}
            />

            {selector.storeName}
          </div>
        );
      }
      if ('folderName' in selector) {
        return (
          <div
            css={css`
              height: 20px;
              line-height: 20px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <SvgIcon
              value={14}
              SvgComponent={IconFolder}
              css={css`
                margin-right: 9px;
                fill: #ffffff;
              `}
            />

            {selector.folderName}
          </div>
        );
      }
      return (
        <div
          css={css`
            height: 20px;
            line-height: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <SvgIcon
            value={14}
            SvgComponent={IconFolder}
            css={css`
              margin-right: 9px;
              fill: #ffffff;
            `}
          />

          {`Unknown-${Math.random()}`}
        </div>
      );
    },
    []
  );

  const solveTreeNodes = useCallback(
    (selectorsParam: (SelectorStore | SelectorStoreFolder)[]): DataNode[] => {
      const result: DataNode[] = [];
      if (selectorsParam && selectorsParam.length > 0) {
        selectorsParam.forEach((selector) => {
          const node: DataNode = {
            key: selector.key,
            title: getTitle(selector),
            children: [], // 初始值为 []
          };
          if (selector.selectors && selector.selectors.length > 0) {
            node.children = selector.selectors.map((item) => ({
              key: item.key,
              title: (
                <div
                  css={css`
                    height: 20px;
                    line-height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                  `}
                >
                  <SvgIcon
                    value={16}
                    SvgComponent={IconSelectorAddByClick}
                    css={css`
                      fill: #ffffff;
                      margin-right: 9px;
                    `}
                  />

                  {item.selectorName}
                </div>
              ),
            }));
          }
          if (selector.folders && selector.folders.length > 0) {
            node.children = [
              ...(node.children ?? []),
              ...uniqBy(solveTreeNodes(selector.folders), 'key').map(
                (folder) => ({
                  ...folder,
                  title: folder.title || folder.key.toString(), // 使用 key 作为默认 title
                })
              ),
            ];
          }
          result.push(node);
        });
        return result;
      }
      return [];
    },
    [getTitle]
  );

  //   const _init = useCallback(async () => {
  //     const _selectors = await getSelectors();
  //     return _selectors ?? [];
  //   }, [getSelectors]);

  useEffect(() => {
    const init = async () => {
      const _selectors = await getSelectors();
      return _selectors ?? [];
    };
    // eslint-disable-next-line promise/catch-or-return
    init().then(() => console.log('initial selector data complete'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectors) {
      const res = solveTreeNodes(selectors);
      setTreeNodes(res);
    }
  }, [selectors, solveTreeNodes]);

  return { treeNodes, getSelectors };
}

const PopMore = memo(() => {
  const createStore = useCallback(() => {
    // todo
    console.log('createStore');
  }, []);
  const help = useCallback(() => {
    // todo
    console.log('help');
  }, []);

  const listItem = useMemo(
    () => [
      {
        label: 'Create Store',
        icon: IconCreatestore,
        action: createStore,
      },
      {
        label: 'Help',
        icon: IconHelp,
        action: help,
      },
    ],
    [createStore, help]
  );

  return (
    <div
      css={css`
        z-index: 5;
        box-sizing: border-box;
        position: absolute;
        width: 125px;
        height: 68px;
        left: 188px;
        top: 55px;
        background: #ffffff;
        border: 1px solid #ebecf2;
        border-radius: 4px;
        padding: 8px;
        display: flex;
        flex-direction: column;
      `}
    >
      {listItem.map((item, key) => {
        const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
          if (event.key === 'Enter') {
            item.action();
          }
        };
        const _key = Math.random() + key;
        return (
          <div
            key={_key}
            onClick={item.action}
            tabIndex={_key}
            role="button"
            onKeyDown={handleKeyDown}
            css={css`
              flex: 1;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              border-radius: 2px;
              background-color: #ffffff;
              :hover {
                background-color: #eaeaeb;
              }
            `}
          >
            <SvgIcon
              SvgComponent={item.icon}
              value={16}
              css={css`
                margin-left: 12px;
                margin-right: 6px;
                fill: #ffffff;
              `}
            />

            <span
              css={css`
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                /* identical to box height, or 167% */

                color: #131520;
              `}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
});

const findKeyBySelectorName = (
  nodes: SelectorStore[] | SelectorStoreFolder[],
  selectorName: string
): Key[] => {
  const res: Key[] = []; // 新增数组 res 保存结果
  nodes.forEach((node) => {
    if (node.selectors) {
      const selectorNode = node.selectors.find(
        (selector) => selector.selectorName === selectorName
      );
      if (selectorNode) {
        res.push(selectorNode.key);
      }
    }
    if (node.folders) {
      const keys = findKeyBySelectorName(node.folders, selectorName);
      res.push(...keys); // 使用展开语法添加 keys 数组元素到 res 中
    }
  });
  return res;
};

export const SelectorTree = memo((props: { visible: boolean }) => {
  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  const selectors = useSelectorStore((state) => state.selectors);
  //   const setSelectorByIndex = useSelectorStore(
  //     (state) => state.setSelectorByIndex
  //   );
  const deleteByIndex = useSelectorStore((state) => state.deleteByIndex);
  const currSelectedItem = useSmartStepListStore(
    (state) => state.currSelectedItem
  );
  const { treeNodes } = useSelectorTreeData();

  const [showMore, setShowMore] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [expandKeys, setExpandKeys] = useState<Key[]>(selectedKeys);

  const selectedKeysSwitch = useMemo(() => {
    return smartMode
      ? findKeyBySelectorName(selectors, currSelectedItem?.targetSelector)
      : selectedKeys;
  }, [currSelectedItem?.targetSelector, selectedKeys, selectors, smartMode]);

  const expandKeysSwitch = useMemo(() => {
    return smartMode
      ? findKeyBySelectorName(selectors, currSelectedItem?.targetSelector)
      : expandKeys;
  }, [currSelectedItem?.targetSelector, expandKeys, selectors, smartMode]);

  useEffect(() => {
    if (smartMode) {
      setSelectedKeys([]);
      setExpandKeys([]);
    }
  }, [smartMode]);

  const handleClickShowMore = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSelect = useCallback<Defined<SelectEvent>>((keys, info) => {
    setSelectedKeys(keys);
  }, []);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onExpand = useCallback<Defined<ExpandEvent>>((keys, info) => {
    setExpandKeys(keys);
  }, []);

  // ===================Treenode右键菜单自定义相关=====================

  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const [currRightClickingItem, setCurrRightClickingItem] = useState<
    MyDataNode | undefined
  >();

  console.log({ currRightClickingItem });

  const listItemsForSelector: MenuProps['items'] = useMemo(
    () => [
      {
        label: 'Recapture',
        key: 'recapture',
      },
      {
        label: 'Rename',
        key: 'rename',
      },
      {
        label: 'Delete',
        key: 'delete',
      },
    ],
    []
  );
  const listItemsForStore: MenuProps['items'] = useMemo(
    () => [
      {
        label: 'New Folder',
        key: 'newfolder',
      },
      {
        label: 'Rename',
        key: 'rename',
      },
      {
        label: 'Delete',
        key: 'delete',
      },
    ],
    []
  );
  const itemsSwitcher = useMemo(() => {
    if (currRightClickingItem && 'children' in currRightClickingItem) {
      return listItemsForStore;
    }
    if (currRightClickingItem?.children?.length === 0) {
      return listItemsForSelector;
    }
    return listItemsForSelector;
  }, [currRightClickingItem, listItemsForSelector, listItemsForStore]);

  const onClickDropDownMenuItems = useCallback<Defined<MenuProps['onClick']>>(
    ({ key }) => {
      switch (key) {
        case 'delete': {
          if (currRightClickingItem?.key) {
            deleteByIndex(currRightClickingItem?.key.toString());
          }
          break;
        }
        // todo
        default:
          break;
      }
      return null;
    },
    [currRightClickingItem?.key, deleteByIndex]
  );

  const dropDownMenu = useMemo(() => {
    return {
      items: itemsSwitcher,
      onClick: onClickDropDownMenuItems,
    };
  }, [itemsSwitcher, onClickDropDownMenuItems]);

  //   右键显示菜单info
  const handleContextMenu = useCallback<Defined<RightClickEvent>>((info) => {
    if (info.node) {
      setIsOpenDropDown(true);
      setCurrRightClickingItem(info.node);
    } else {
      setIsOpenDropDown(false);
      setCurrRightClickingItem(undefined);
    }
    return info.node;
  }, []);

  const handleDocumentClick = useCallback(() => {
    setIsOpenDropDown(false);
  }, []);
  const handleDocumentRightClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const antTreeListHolder = document.querySelector('.ant-tree-list-holder');
    const isAntTreeListHolderChild = antTreeListHolder?.contains(target);
    if (
      (target?.className &&
        typeof target.className === 'string' &&
        target?.className?.indexOf('node') !== -1) ||
      isAntTreeListHolderChild === true
    ) {
      setIsOpenDropDown(true);
    } else {
      setIsOpenDropDown(false);
    }
  }, []);

  useEffect(() => {
    document?.addEventListener('click', handleDocumentClick);
    document?.addEventListener('contextmenu', handleDocumentRightClick);
    return () => {
      document?.removeEventListener('click', handleDocumentClick);
      document?.removeEventListener('contextmenu', handleDocumentRightClick);
    };
  }, [handleDocumentClick, handleDocumentRightClick]);

  // =========================================

  return (
    <div
      css={css`
        position: relative;
        display: ${props.visible ? 'flex' : 'none'};
        background-color: #f5f5f7;
        flex: 1;
        width: 100%;
        min-height: 0px;
        height: 100%;
      `}
    >
      <Button
        type="text"
        css={css`
          position: absolute;
          top: 23px;
          right: 24px;
          box-shadow: none !important;
          outline: none !important;
          border: 0 !important;
          height: 0px;
          z-index: 5;
        `}
        icon={<SvgIcon SvgComponent={IconMore} value={24} />}
        onClick={handleClickShowMore}
      />
      {showMore && <PopMore />}
      <div
        css={css`
          display: flex;
          flex: 1;
          overflow: auto;
          /* max-height: 363px; */
          max-height: 478px;
          margin-top: 23px;
          margin-right: 24px;
          margin-left: 24px;
          ::-webkit-scrollbar-track {
            background-color: #f5f5f7;
          }
          .ant-tree.ant-tree-block-node
            .ant-tree-list-holder-inner
            .ant-tree-node-content-wrapper {
            flex: none;
          }
          .ant-tree .ant-tree-switcher .ant-tree-switcher-icon svg {
            fill: #c4c4c4;
          }
          .ant-tree.ant-tree-directory .ant-tree-treenode-selected::before {
            background: #e4e4e5;
          }
          .ant-tree-title {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 300;
            font-size: 12px;
            line-height: 20px;
            /* identical to box height, or 167% */

            color: #131520;
          }
          span.anticon-folder-open {
            svg {
              fill: #ff8a00;
            }
          }
        `}
      >
        <Dropdown
          menu={dropDownMenu}
          trigger={['contextMenu']}
          open={isOpenDropDown}
          destroyPopupOnHide
        >
          <DirectoryTree
            defaultExpandAll
            autoExpandParent
            defaultExpandParent
            selectedKeys={selectedKeysSwitch}
            expandedKeys={expandKeysSwitch}
            showIcon={false}
            expandAction="doubleClick"
            onRightClick={handleContextMenu}
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeNodes}
            css={css`
              display: flex;
              flex: 1;
              width: 100%;
              background-color: #f5f5f7;

              .ant-tree-list {
                flex: 1;
              }
              .ant-tree-node-content-wrapper {
                flex: 1 !important;
              }
              .ant-tree-title {
                div {
                  justify-content: left;
                  flex: 1;
                }
              }
            `}
          />
        </Dropdown>
      </div>
    </div>
  );
});
