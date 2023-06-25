/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as IconMore } from '@/assets/imgs/icon-more-normalmode.svg';
import { ReactComponent as IconHelp } from '@/assets/imgs/icon-help.svg';
import { ReactComponent as IconCreatestore } from '@/assets/imgs/icon-createstore.svg';
import { ReactComponent as IconStore } from '@/assets/imgs/icon-store.svg';
import { ReactComponent as IconSelectorAddByClick } from '@/assets/imgs/icon-selector-addby-click.svg';
import { ReactComponent as IconFolder } from '@/assets/imgs/icon-folder.svg';

import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import Tree from 'antd/es/tree';
import { uniqBy } from 'lodash-es';
import { useSmartStepListStore } from '@/store/smartMode/stepList';
import type { Key } from 'rc-tree/lib/interface';
import { SelectorStore, SelectorStoreFolder } from '@/models/SelectorStore';
import { useSelectorStore } from '@/store/selectorStore';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import Button from '../components/Button';
import SvgIcon from '../components/SvgIcon';

const { DirectoryTree } = Tree;

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
        return (
          <div
            key={key}
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
            onClick={item.action}
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
  let res: Key[] = []; // 新增数组 res 保存结果
  for (const node of nodes) {
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
      res = res.concat(keys); // 引用数组方法 concat 将数组合并到 res 中
    }
  }
  return res;
};

export const SelectorTree = memo(() => {
  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  const selectors = useSelectorStore((state) => state.selectors);
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

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    setSelectedKeys(keys);
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    setExpandKeys(keys);
  };

  return (
    <div
      css={css`
        position: relative;
        display: flex;
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
        <DirectoryTree
          defaultExpandAll
          autoExpandParent
          defaultExpandParent
          selectedKeys={selectedKeysSwitch}
          expandedKeys={expandKeysSwitch}
          showIcon={false}
          expandAction="doubleClick"
          css={css`
            display: flex;
            flex: 1;
            width: 100%;
            background-color: #f5f5f7;

            .ant-tree-list {
              flex: 1;
            }
          `}
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeNodes}
        />
      </div>
    </div>
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
    (selectors: (SelectorStore | SelectorStoreFolder)[]): DataNode[] => {
      const result: DataNode[] = [];
      if (selectors && selectors.length > 0) {
        selectors.forEach((selector) => {
          const node: DataNode = {
            key: selector.key,
            title: getTitle(selector),
            children: [], // 初始值为 []
          };
          if (selector.selectors && selector.selectors.length > 0) {
            node.children = selector.selectors.map((selector) => ({
              key: selector.key,
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

                  {selector.selectorName}
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

  const init = useCallback(async () => {
    const _selectors = await getSelectors();
    return _selectors;
  }, [getSelectors]);

  useEffect(() => {
    init();
    console.log();
  }, [init]);

  useEffect(() => {
    if (selectors) {
      const res = solveTreeNodes(selectors);
      setTreeNodes(res);
    }
  }, [selectors, solveTreeNodes]);

  return { treeNodes, getSelectors };
}
