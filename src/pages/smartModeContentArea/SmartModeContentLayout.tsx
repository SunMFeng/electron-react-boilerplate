/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { memo } from 'react';
import { StepListContainer } from './components/StepListContainer';

export const SmartModeContentLayout = memo(() => {
  return (
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
  );
});
