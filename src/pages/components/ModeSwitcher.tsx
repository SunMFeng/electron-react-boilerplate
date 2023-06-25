/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { memo, useCallback } from 'react';
import { ReactComponent as IconQuestion } from '@/assets/imgs/icon-question.svg';
import { ReactComponent as IconExpand } from '@/assets/imgs/icon-expand.svg';
import { Switch, Tooltip } from 'antd';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import SvgIcon from './SvgIcon';
import Button from './Button';

export const ModeSwitcher = memo(() => {
  const smartMode = useModeSwitcherStore((state) => state.smartMode);
  const setSmartMode = useModeSwitcherStore((state) => state.setSmartMode);
  const selectorPanelExpanded = useModeSwitcherStore(
    (state) => state.selectorPanelExpanded
  );
  const setSelectorPanelExpanded = useModeSwitcherStore(
    (state) => state.setSelectorPanelExpanded
  );

  const handleSwitchChanged = useCallback(() => {
    setSmartMode(!smartMode);
  }, [setSmartMode, smartMode]);

  const handleClickExpand = useCallback(() => {
    setSelectorPanelExpanded(!selectorPanelExpanded);
  }, [setSelectorPanelExpanded, selectorPanelExpanded]);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        flex: 1;
        width: 100%;
        height: 56px;
        max-height: 57px;
        background: #ffffff;
        position: relative;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          width: 100%;
          max-width: 327px;
          height: 56px;
          max-height: 57px;
          background: #ffffff;
        `}
      >
        <div
          css={css`
            display: flex;
            flex: 1;
            width: 100%;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          `}
        >
          <div
            css={css`
              display: flex;
              flex: 1;
              width: 100%;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            `}
          >
            <p
              css={css`
                margin-left: 24px;
                height: 20px;
                line-height: 20px;
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                font-size: 12px;
                color: #131520;
                margin-right: 4px;
              `}
            >
              Smart Mode:
            </p>
            <Tooltip title="TODO">
              <div
                css={css`
                  height: 16px;
                `}
              >
                <SvgIcon SvgComponent={IconQuestion} value={16} />
              </div>
            </Tooltip>
          </div>

          <div
            css={css`
              flex: 1;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
            `}
          >
            <Switch checked={smartMode} onChange={handleSwitchChanged} />
          </div>
        </div>
      </div>
      {smartMode && (
        <Button
          type="text"
          css={css`
            position: absolute;
            top: 18px;
            right: 10px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            align-items: center;
            justify-content: center;
            display: flex;
            border: 1px solid #8f9bb3;
            border-radius: 50%;
            svg {
              flex: 1;
            }
          `}
          onClick={handleClickExpand}
        >
          <SvgIcon
            SvgComponent={IconExpand}
            value={14}
            css={
              selectorPanelExpanded && [
                css`
                  transition: transform 0.5s ease;
                  transform: rotate(180deg);
                `,
              ]
            }
          />
        </Button>
      )}
    </div>
  );
});
