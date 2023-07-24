/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { memo, useCallback, useEffect } from 'react';
import { ReactComponent as IconQuestion } from '@/assets/imgs/icon-question.svg';
import { ReactComponent as IconExpand } from '@/assets/imgs/icon-expand.svg';
import { Switch, Tooltip } from 'antd';
import { useModeSwitcherStore } from '@/store/modeSwitcher';
import { MessageType } from '@/main/messagetype';
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

  useEffect(() => {
    // const app = document.querySelector('.App') as HTMLDivElement;
    if (smartMode !== true) {
      // app.style.width = '327px';
      window.electron.ipcRenderer.sendMessage('ipc-example', {
        messageType: MessageType.ChangeWindowSize,
        messageContent: {
          height: 648,
          width: 329,
        },
      });
    } else if (smartMode === true && selectorPanelExpanded === true) {
      // app.style.width = '654px';
      window.electron.ipcRenderer.sendMessage('ipc-example', {
        messageType: MessageType.ChangeWindowSize,
        messageContent: {
          width: 656,
          height: 648,
        },
      });
    }
  }, [selectorPanelExpanded, smartMode]);

  const handleClickExpand = useCallback(() => {
    console.log({ selectorPanelExpanded });

    setSelectorPanelExpanded(!selectorPanelExpanded);
  }, [setSelectorPanelExpanded, selectorPanelExpanded]);

  useEffect(() => {
    // const app = document.querySelector('.App') as HTMLDivElement;

    if (selectorPanelExpanded === true) {
      // app.style.width = '654px';
      window.electron.ipcRenderer.sendMessage('ipc-example', {
        messageType: MessageType.ChangeWindowSize,
        messageContent: {
          width: 648,
          height: 646,
        },
      });
    } else {
      // app.style.width = '327px';
      window.electron.ipcRenderer.sendMessage('ipc-example', {
        messageType: MessageType.ChangeWindowSize,
        messageContent: {
          height: 646,
          width: 330,
        },
      });
    }
  }, [selectorPanelExpanded]);

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
          // max-width: 327px;
          height: 56px !important;
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
              智能模式:
            </p>
            <Tooltip title="开启智能录制后，将会记录您在页面的所有操作并按照操作顺序生成代码。">
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
            -webkit-app-region: no-drag;
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
