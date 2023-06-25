/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { memo, useCallback } from 'react';
import { Space } from 'antd';
import Button from './Button';

const cssButton = css`
  display: flex;
  align-items: center;
  padding: 0;
  font-size: 14px;
  width: 94px;
  height: 32px;
`;

// eslint-disable-next-line import/prefer-default-export
export const AppFooter = memo(() => {
  const handleClickComplete = useCallback(() => {
    // todo
  }, []);

  const handleClickCancel = useCallback(() => {
    // todo
  }, []);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex: 0 0 auto;
        width: 100%;
        height: 64px;
        max-height: 64px;
        background: #ffffff;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
      `}
    >
      <Space
        size={8}
        css={css`
          margin-right: 24px;
        `}
      >
        <Button css={cssButton} type="primary" onClick={handleClickComplete}>
          <div
            css={css`
              display: flex;
              margin: auto;
            `}
          >
            Complete
          </div>
        </Button>
        <Button css={cssButton} type="default" onClick={handleClickCancel}>
          <div
            css={css`
              display: flex;
              margin: auto;
            `}
          >
            Cancel
          </div>
        </Button>
      </Space>
    </div>
  );
});
