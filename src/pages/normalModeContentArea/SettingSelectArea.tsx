/** @jsxImportSource @emotion/react */
import {
  AdvancedOptionType,
  CaptureTechnologyType,
} from '@/models/SettingSelectArea';
import { useSettingAreaStore } from '@/store/normalMode/settingSelectArea';
import { css } from '@emotion/react';
import { Select } from 'antd';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

const cssGeneral = css`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background: #ffffff;
`;
const cssSelect = css`
  width: 151px;
  .ant-select-selector {
    height: 24px;
  }
`;
const cssLabelText = css`
  margin-left: 24px;
  height: 20px;
  line-height: 20px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  color: #131520;
`;

interface SettingSelectAreaProps {
  cursorPosition?: { x: number; y: number };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SettingSelectArea = memo((props: SettingSelectAreaProps) => {
  //   const { cursorPosition } = props;
  const captureTechSelected = useSettingAreaStore(
    (state) => state.captureTechSelected
  );
  const setCaptureTechSelected = useSettingAreaStore(
    (state) => state.setCaptureTechSelected
  );
  const advancedOptionSelected = useSettingAreaStore(
    (state) => state.advancedOptionSelected
  );
  const setAdvancedOptionSelected = useSettingAreaStore(
    (state) => state.setAdvancedOptionSelected
  );

  const handleCaptureOptionChanged = useCallback(
    (value: CaptureTechnologyType) => {
      setCaptureTechSelected(value);
    },
    [setCaptureTechSelected]
  );
  const handleAdvancedOptionChanged = useCallback(
    (value: AdvancedOptionType) => {
      setAdvancedOptionSelected(value);
    },
    [setAdvancedOptionSelected]
  );

  // mock: 鼠标坐标
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const handleWindowMouseMove = useCallback((event: MouseEvent) => {
    setGlobalCoords({
      x: event.screenX,
      y: event.screenY,
    });
  }, []);
  useEffect(() => {
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, [handleWindowMouseMove]);

  useEffect(() => {
    console.log({ captureTechSelected }); // test, todo: delete
  }, [captureTechSelected]);
  useEffect(() => {
    console.log({ advancedOptionSelected }); // test, todo: delete
  }, [advancedOptionSelected]);

  const captureOptions: {
    label: string;
    value: CaptureTechnologyType;
  }[] = useMemo(
    () => [
      {
        label: 'AutoDetect',
        value: 'AutoDetect',
      },
      {
        label: 'UIA',
        value: 'UIA',
      },
      {
        label: 'Chrome',
        value: 'Chrome',
      },
      {
        label: 'Edge',
        value: 'Edge',
      },
      {
        label: 'Firefox',
        value: 'Firefox',
      },
      {
        label: 'IE',
        value: 'IE',
      },
      {
        label: 'Java',
        value: 'Java',
      },
      {
        label: 'IA',
        value: 'IA',
      },
      {
        label: 'SAP',
        value: 'SAP',
      },
    ],
    []
  );

  const advancedOptions: {
    label: string;
    value: AdvancedOptionType;
  }[] = useMemo(
    () => [
      {
        label: 'None',
        value: '',
      },
      {
        label: 'XPath',
        value: 'XPath',
      },
    ],
    []
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 0 0 auto;
        width: 100%;
        background: #ffffff;
      `}
    >
      <div css={cssGeneral}>
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
          <p css={cssLabelText}>Capture Technology:</p>
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
          <Select
            css={cssSelect}
            options={captureOptions}
            value={captureTechSelected}
            onChange={handleCaptureOptionChanged}
          />
        </div>
      </div>
      <div css={cssGeneral}>
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
          <p css={cssLabelText}>Advanced Option:</p>
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
          <Select
            css={cssSelect}
            options={advancedOptions}
            value={advancedOptionSelected}
            onChange={handleAdvancedOptionChanged}
          />
        </div>
      </div>
      <div css={cssGeneral}>
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
          <p css={cssLabelText}>Cursor Position(X,Y):</p>
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
          <span
            css={css`
              padding-left: 12px;
              font-family: 'Source Han Sans CN';
              font-style: normal;
              font-weight: 350;
              font-size: 12px;
              line-height: 20px;
              /* identical to box height, or 167% */

              color: #515361;
            `}
          >{`(${globalCoords.x}, ${globalCoords.y})`}</span>
        </div>
      </div>
    </div>
  );
});
