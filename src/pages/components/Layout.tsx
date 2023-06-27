/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { Fragment, memo } from 'react';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { AppHeader } from './AppHeader';
import { ModeSwitcher } from './ModeSwitcher';
import { NormalModeContentLayout } from '../normalModeContentArea/NormalModeContentLayout';
import { AppFooter } from './AppFooter';
import { SmartModeContentLayout } from '../smartModeContentArea/SmartModeContentLayout';
import { SelectorTree } from '../normalModeContentArea/SelectorTree';

export const Layout = memo(() => {
  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  const selectorPanelExpanded = useModeSwitcherStore(
    (state) => state.selectorPanelExpanded
  );
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        width: 100%;
        height: 100%;
      `}
    >
      <AppHeader />
      <ModeSwitcher />
      <div
        css={css`
          display: flex;
          flex: 1 0 auto;
          flex-direction: row;
          align-items: center;
          width: 100%;
          min-height: 0px;
          max-height: 485px;
        `}
      >
        {smartMode ? (
          <>
            <SmartModeContentLayout />
            <SelectorTree visible={selectorPanelExpanded} />
          </>
        ) : (
          <NormalModeContentLayout />
        )}
      </div>
      <AppFooter />
    </div>
  );
});
