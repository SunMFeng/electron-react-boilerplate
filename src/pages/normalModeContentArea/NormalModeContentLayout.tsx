/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { memo } from 'react';
import { DataNode } from 'antd/es/tree';
import { SettingSelectArea } from './SettingSelectArea';
import { SelectorTree } from './SelectorTree';

export const NormalModeContentLayout = memo((props: { data: DataNode[] }) => {
  const { data } = props;
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
        width: 100%;
        height: 100%;
        min-height: 0px;
        background-color: #f5f5f7;
      `}
    >
      <SettingSelectArea />
      <SelectorTree visible data={data} />
    </div>
  );
});
