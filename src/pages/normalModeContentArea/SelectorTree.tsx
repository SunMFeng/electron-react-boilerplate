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
import type { DataNode } from 'antd/es/tree';
import Tree from 'antd/es/tree';
import { uniqBy } from 'lodash-es';
import { useSmartStepListStore } from '@/store/smartMode/stepList';
import type { Key } from 'rc-tree/lib/interface';
import { SelectorStore, SelectorStoreFolder } from '@/models/SelectorStore';
import { useSelectorStore } from '@/store/selectorStore';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { useSelectorTree } from '@/store/selectorTree';
import { Dropdown, MenuProps } from 'antd';
import { StepItem } from '@/models/StepList';
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
// type MyDataNode = EventDataNode<DataNode>;

interface SelectorTreeProps {
  visible: boolean;
  data: DataNode[];
}
const cssTitleOfSelectorTree = css`
  max-width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const NameChangeInput = React.memo(function NameChangeInputContext(props: {
  index: string;
  defaultValue: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}) {
  const { index, defaultValue, onChange, onKeyDown } = props;
  return (
    <input
      key={`input-name-editing-area: ${index}-${defaultValue}`}
      type="text"
      id={`input-name-editing-${index}`}
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus // 由于只会在出现rename时获得autofocus所以应该不会影响用户操作性
      css={css`
        flex: 1;
        width: auto;
        box-sizing: border-box;
        min-width: 10px;
        border: 0;
        :focus {
          outline: 0;
        }
      `}
    />
  );
});

/**
 * @function useSelectorTreeData: 总结转化为自定义化;
 * @param selectors: api返回元数据(回显时 or etc.)
 * @returns treeNodes: 过滤后为antd组件可用的DataNode[]
 * @returns getSelectors: api请求selector列表
 */
export function useSelectorTreeData() {
  const selectors = useSelectorStore((state) => state.selectors);
  const currRightClickingItem = useSelectorStore(
    (state) => state.currRightClickingItem
  );
  const currDropDownMenuAction = useSelectorStore(
    (state) => state.currDropDownMenuAction
  );

  const getSelectors = useSelectorStore((state) => state.getSelectors);
  const setNameByIndex = useSelectorStore((state) => state.setNameByIndex);
  const setCurrDropDownMenuAction = useSelectorStore(
    (state) => state.setCurrDropDownMenuAction
  );

  const [treeNodes, setTreeNodes] = useState<DataNode[]>([]);

  const [newName, setNewName] = useState<string>();

  const handleChangeNameInput: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        if (currDropDownMenuAction === 'rename' && e.target?.value) {
          setNewName(e.target?.value);
        }
      },
      [currDropDownMenuAction]
    );
  const handleChangeNameInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        if (currRightClickingItem && e.key === 'Enter') {
          if (newName) {
            setNameByIndex({
              index: currRightClickingItem.key.toString(),
              name: newName,
            });
            setNewName(undefined);
          }
          setCurrDropDownMenuAction(undefined);
        }
      },
      [
        currRightClickingItem,
        newName,
        setCurrDropDownMenuAction,
        setNameByIndex,
      ]
    );

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

            {currRightClickingItem?.key === selector.key &&
            currDropDownMenuAction === 'rename' ? (
              <NameChangeInput
                index={currRightClickingItem?.key}
                defaultValue={selector.storeName}
                onChange={handleChangeNameInput}
                onKeyDown={handleChangeNameInputKeyDown}
              />
            ) : (
              <span css={cssTitleOfSelectorTree}>{selector.storeName}</span>
            )}
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

            {currRightClickingItem?.key === selector.key &&
            currDropDownMenuAction === 'rename' ? (
              <NameChangeInput
                index={currRightClickingItem?.key}
                defaultValue={selector.folderName}
                onChange={handleChangeNameInput}
                onKeyDown={handleChangeNameInputKeyDown}
              />
            ) : (
              <span css={cssTitleOfSelectorTree}>{selector.folderName}</span>
            )}
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
          Unknown
        </div>
      );
    },
    [
      currDropDownMenuAction,
      currRightClickingItem?.key,
      handleChangeNameInput,
      handleChangeNameInputKeyDown,
    ]
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

                  {/* {item.selectorName} */}

                  {currRightClickingItem?.key === item.key &&
                  currDropDownMenuAction === 'rename' ? (
                    <NameChangeInput
                      index={currRightClickingItem?.key}
                      defaultValue={item.selectorName}
                      onChange={handleChangeNameInput}
                      onKeyDown={handleChangeNameInputKeyDown}
                    />
                  ) : (
                    <span css={cssTitleOfSelectorTree}>
                      {item.selectorName}
                    </span>
                  )}
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
    [
      currDropDownMenuAction,
      currRightClickingItem?.key,
      getTitle,
      handleChangeNameInput,
      handleChangeNameInputKeyDown,
    ]
  );
  // todo: init 请求获取tree结构，实现需要沟通有待商榷，先靠接受后端主动postmessage
  // const init = useCallback(async () => {
  //   const _selectors = await getSelectors();
  //   return _selectors ?? [];
  // }, [getSelectors]);

  // useEffect(() => {
  //   init();
  // }, [init]);

  useEffect(() => {
    if (selectors) {
      const res = solveTreeNodes(selectors);
      setTreeNodes(res);
    }
  }, [selectors, solveTreeNodes]);
  return { treeNodes, getSelectors };
}

const PopMore = memo(
  (props: { visible: boolean; onClickMenuItem: () => void }) => {
    const { visible, onClickMenuItem } = props;
    const createStoreAction = useSelectorStore((state) => state.createStore);

    const createStore = useCallback(() => {
      createStoreAction();
      onClickMenuItem();
    }, [createStoreAction, onClickMenuItem]);
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
          display: ${visible ? `flex` : `none`};
          cursor: pointer;
          flex-direction: column;
        `}
      >
        {listItem.map((item, key) => {
          const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (
            event
          ) => {
            if (event.key === 'Enter') {
              item.action();
            }
          };
          const _key = key;
          return (
            <div
              key={_key}
              onClick={item.action}
              tabIndex={_key}
              role="button"
              onKeyDown={handleKeyDown}
              css={css`
                -webkit-app-region: no-drag;
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
  }
);

export const findKeyBySelectorName = (
  nodes: SelectorStore[] | SelectorStoreFolder[],
  info: StepItem
): Key[] => {
  const res: Key[] = []; // 新增数组 res 保存结果
  nodes.forEach((node) => {
    if (node.selectors) {
      const selectorNode = node.selectors.find(
        (selector) => selector.selectorName === info?.targetSelector
      );
      if (selectorNode) {
        if ('folderName' in info) {
          if ('folderName' in node && node.folderName === info.folderName) {
            res.push(selectorNode.key);
          } else if (
            'storeName' in node &&
            node.storeName === info.folderName
          ) {
            res.push(selectorNode.key);
          }
        } else {
          res.push(selectorNode.key);
        }
      }
    }
    if (node.folders) {
      const keys = findKeyBySelectorName(node.folders, info);
      res.push(...keys); // 使用展开语法添加 keys 数组元素到 res 中
    }
  });

  // console.log({ info, res });

  return res;
};

export const SelectorTree = memo((props: SelectorTreeProps) => {
  const { data, visible } = props;

  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  const selectors = useSelectorStore((state) => state.selectors);
  const setCurrActiveContainer = useSelectorStore(
    (state) => state.setCurrActiveContainer
  );
  const deleteByIndex = useSelectorStore((state) => state.deleteByIndex);
  const currSelectedItem = useSmartStepListStore(
    (state) => state.currSelectedItem
  );
  const selectedKeys = useSelectorTree((state) => state.selectedKeys);
  const expandKeys = useSelectorTree((state) => state.expandKeys);
  const setSelectedKeys = useSelectorTree((state) => state.setSelectedKeys);
  const setExpandKeys = useSelectorTree((state) => state.setExpandKeys);

  const [showMore, setShowMore] = useState(false);

  const selectedKeysSwitch = useMemo(() => {
    return smartMode && currSelectedItem
      ? findKeyBySelectorName(selectors, currSelectedItem)
      : selectedKeys;
  }, [currSelectedItem, selectedKeys, selectors, smartMode]);

  const expandKeysSwitch = useMemo(() => {
    return smartMode && currSelectedItem
      ? findKeyBySelectorName(selectors, currSelectedItem)
      : expandKeys;
  }, [currSelectedItem, expandKeys, selectors, smartMode]);

  const handleClickShowMore = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSelect = useCallback<Defined<SelectEvent>>(
    (keys, info) => {
      setSelectedKeys(keys);
      if ('children' in info.node) {
        setCurrActiveContainer({
          key: info.node.key.toString(),
          name: info.node.title?.toString() ?? 'Unknown',
        });
      } else {
        // todo: find father node and set its key
        console.log('todo: find father node and set its key');
      }
    },
    [setCurrActiveContainer, setSelectedKeys]
  );
  const onExpand = useCallback<Defined<ExpandEvent>>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (keys, info) => {
      setExpandKeys(keys);
    },
    [setExpandKeys]
  );

  // ===================Treenode右键菜单自定义相关=====================

  const [isOpenDropDown, setIsOpenDropDown] = useState(false);
  const currRightClickingItem = useSelectorStore(
    (state) => state.currRightClickingItem
  );
  const setCurrRightClickingItem = useSelectorStore(
    (state) => state.setCurrRightClickingItem
  );
  const setCurrDropDownMenuAction = useSelectorStore(
    (state) => state.setCurrDropDownMenuAction
  );
  const createNewFolder = useSelectorStore((state) => state.createNewFolder);

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
      if (currRightClickingItem?.key) {
        switch (key) {
          case 'delete': {
            deleteByIndex(currRightClickingItem?.key.toString());

            break;
          }
          case 'rename': {
            setCurrDropDownMenuAction('rename');
            break;
          }
          case 'newfolder': {
            const returnKey = createNewFolder();
            if (returnKey) {
              setSelectedKeys([...selectedKeys, returnKey]);
              setExpandKeys([...selectedKeys, returnKey]);
            }
            break;
          }
          case 'recapture': {
            // todo
            break;
          }
          default:
            break;
        }
      }
      return null;
    },
    [
      createNewFolder,
      currRightClickingItem?.key,
      deleteByIndex,
      selectedKeys,
      setCurrDropDownMenuAction,
      setExpandKeys,
      setSelectedKeys,
    ]
  );

  const dropDownMenu = useMemo(() => {
    return {
      items: itemsSwitcher,
      onClick: onClickDropDownMenuItems,
    };
  }, [itemsSwitcher, onClickDropDownMenuItems]);

  //   右键显示菜单info
  const handleContextMenu = useCallback<Defined<RightClickEvent>>(
    (info) => {
      if (info.node) {
        setIsOpenDropDown(true);
        setCurrRightClickingItem(info.node);
      } else {
        setIsOpenDropDown(false);
        setCurrRightClickingItem(undefined);
      }
      return info.node;
    },
    [setCurrRightClickingItem]
  );

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

  useEffect(() => {
    if (smartMode) {
      setSelectedKeys([]);
      setExpandKeys([]);
    }
  }, [setExpandKeys, setSelectedKeys, smartMode]);

  // =========================================

  return (
    <div
      css={css`
        position: relative;
        display: ${visible ? 'flex' : 'none'};
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
          -webkit-app-region: no-drag;
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
      <PopMore visible={showMore} onClickMenuItem={handleClickShowMore} />
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
            treeData={data}
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

export default SelectorTree;
