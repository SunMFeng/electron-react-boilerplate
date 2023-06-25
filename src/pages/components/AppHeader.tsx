/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { memo } from 'react';
import SvgIcon from './SvgIcon';
import { ReactComponent as IconCC } from '../../assets/imgs/icon-cc-with-title.svg';

export const AppHeader = memo(() => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        flex: 0 0 auto;
        width: 100%;
        height: 40px;
        max-height: 40px;
        background: #ffffff;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
        border-bottom: 1px solid #ebecf2;
      `}
    >
      <SvgIcon
        css={css`
          margin-left: 24px;
        `}
        SvgComponent={IconCC}
        value={{
          width: 159,
          height: 24,
        }}
      />
    </div>
  );
});
