/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { memo } from 'react';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { DataNode } from 'antd/es/tree';
import { StepListContainer } from './components/StepListContainer';
import { SelectorTree } from '../normalModeContentArea/SelectorTree';

export const SmartModeContentLayout = memo((props: { data: DataNode[] }) => {
  const { data } = props;
  const selectorPanelExpanded = useModeSwitcherStore(
    (state) => state.selectorPanelExpanded
  );
  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          flex: 1;
          align-items: center;
          width: 100%;
          height: 100%;
          background: #f9f9f9;
        `}
      >
        <StepListContainer />
      </div>
      <SelectorTree visible={selectorPanelExpanded} data={data} />
    </>
  );
});
