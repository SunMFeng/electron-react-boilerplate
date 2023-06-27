/** @jsxImportSource @emotion/react */
import { StepItem } from '@/models/StepList';
import { css } from '@emotion/react';
import {
  KeyboardEventHandler,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ReactComponent as IconClick } from '@/assets/imgs/icon-click.svg';
import { ReactComponent as IconDelete } from '@/assets/imgs/icon-delete.svg';
import { ReactComponent as IconLocate } from '@/assets/imgs/icon-locate.svg';
import { ReactComponent as IconPicture } from '@/assets/imgs/icon-picture.svg';
import SvgIcon from '@/pages/components/SvgIcon';
import { Space } from 'antd';
import Button from '@/pages/components/Button';
import { useSmartStepListStore } from '@/store/smartMode/stepList';
import { debounce, isEqual } from 'lodash-es';

interface StepItemContentProps {
  index: number;
  item: StepItem;
}

export const StepItemContent = memo((props: StepItemContentProps) => {
  const { index: indexProps, item: itemProps } = props;
  const stepItems = useSmartStepListStore((state) => state.stepItems);
  const currSelectedItem = useSmartStepListStore(
    (state) => state.currSelectedItem
  );
  const setStepItemByIndex = useSmartStepListStore(
    (state) => state.setStepItemByIndex
  );
  const setStepItems = useSmartStepListStore((state) => state.setStepItems);
  const setCurrSelectedItem = useSmartStepListStore(
    (state) => state.setCurrSelectedItem
  );

  const [item, setItem] = useState(itemProps);
  const [index, setIndex] = useState(indexProps);

  useEffect(() => {
    if (!isEqual(itemProps, item)) {
      setItem(itemProps);
    }
  }, [item, itemProps]);

  useEffect(() => {
    if (!isEqual(indexProps, index)) {
      setIndex(indexProps);
    }
  }, [index, indexProps]);

  const _handleChangeVariableNameInput: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setStepItemByIndex({
          index,
          item: {
            ...item,
            variable: e.target.value,
          },
        });
      },
      [index, item, setStepItemByIndex]
    );

  const handleChangeVariableNameInput = debounce(
    _handleChangeVariableNameInput,
    500
  );

  const _handleChangeSelectorNameInput: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        setStepItemByIndex({
          index,
          item: {
            ...item,
            targetSelector: e.target.value,
          },
        });
      },
      [index, item, setStepItemByIndex]
    );

  const handleChangeSelectorNameInput = debounce(
    _handleChangeSelectorNameInput,
    500
  );

  const handleClickLocate = useCallback(() => {
    // todo
    console.log('handleClickLocate');
  }, []);

  const handleClickDelete = useCallback(() => {
    const _items = [...stepItems];

    _items.splice(index, 1);

    setStepItems(_items);
  }, [index, setStepItems, stepItems]);

  useEffect(() => {
    const selectorInputElement = document.getElementById(
      `selector-editable-input-${index}`
    ) as HTMLInputElement;

    const setTargetInputWidth = () => {
      selectorInputElement.style.width = `${
        (selectorInputElement.value.length + 1) * 8
      }px`;
    };

    if (selectorInputElement) {
      setTargetInputWidth();
    }
  }, [index]);

  useEffect(() => {
    const variableInputElement = document.getElementById(
      `variable-editable-input-${index}`
    ) as HTMLInputElement;
    const setTargetInputWidth = () => {
      variableInputElement.style.width = `${
        ((variableInputElement?.value?.length ?? 0) + 1) * 8
      }px`;
    };

    if (variableInputElement) {
      setTargetInputWidth();
    }
  }, [index]);

  useEffect(() => {
    const selectorInputElement = document.getElementById(
      `selector-editable-input-${index}`
    ) as HTMLInputElement;

    const setTargetInputWidth = () => {
      selectorInputElement.style.width = `${
        (selectorInputElement.value.length + 1) * 8
      }px`;
    };

    if (selectorInputElement && currSelectedItem?.index === index) {
      selectorInputElement.addEventListener('blur', setTargetInputWidth);
    }

    return () => {
      selectorInputElement?.removeEventListener('blur', setTargetInputWidth);
    };
  }, [index, currSelectedItem]);

  useEffect(() => {
    const variableInputElement = document.getElementById(
      `variable-editable-input-${index}`
    ) as HTMLInputElement;
    const setTargetInputWidth = () => {
      variableInputElement.style.width = `${
        ((variableInputElement?.value?.length ?? 0) + 1) * 8
      }px`;
    };

    if (variableInputElement && currSelectedItem?.index === index) {
      variableInputElement.addEventListener('blur', setTargetInputWidth);
    }

    return () => {
      variableInputElement?.removeEventListener('blur', setTargetInputWidth);
    };
  }, [index, currSelectedItem]);

  const titleInfo = useMemo(() => {
    switch (item.type) {
      case 'click':
        return {
          icon: IconClick,
          title: '点击',
        };
      case 'input':
        return {
          icon: IconClick, // todo
          title: '输入文本',
        };
      default:
        return {
          icon: IconClick,
          title: '点击',
        };
    }
  }, [item.type]);

  const descriptionContent = useMemo((): React.ReactNode => {
    switch (item.type) {
      case 'click':
        return (
          <>
            <span>{`点击${item.folderName}上的`}</span>
            <div
              css={css`
                height: 16px;
                line-height: 16px;
                border: 1px solid #e2e3ed;
                padding: 1px 8px;
                background-color: #ffffff;
              `}
            >
              <span className="selector-name">{item.targetSelector}</span>
              <SvgIcon SvgComponent={IconPicture} value={16} />
            </div>
          </>
        );
      case 'input':
        return (
          <>
            <span>在</span>
            <div
              css={css`
                max-width: 110px;
                height: 16px;
                line-height: 16px;
                border: 1px solid #e2e3ed;
                padding: 1px 8px;
                background-color: #ffffff;
              `}
            >
              <input
                type="text"
                className="selector-name"
                id={`selector-editable-input-${index}`}
                defaultValue={item.targetSelector}
                onChange={handleChangeSelectorNameInput}
                css={css`
                  flex: 1;
                  width: auto;
                  box-sizing: border-box;
                  min-width: 10px;
                  border: 0;
                  :focus {
                    outline: 0;
                  }
                `}
              />

              {/* <span className="selector-name">{item.targetSelector}</span> */}

              <SvgIcon SvgComponent={IconPicture} value={16} />
            </div>
            <span
              css={css`
                white-space: nowrap;
              `}
            >
              输入
            </span>
            <div
              css={css`
                height: 16px;
                line-height: 16px;
                border: 1px solid #e2e3ed;
                padding: 1px 8px;
                flex: 0 0 auto;
                max-width: 85px;
                display: flex;
                background-color: #ffffff;
              `}
            >
              <input
                type="text"
                className="variable-name"
                id={`variable-editable-input-${index}`}
                defaultValue={item.variable}
                onChange={handleChangeVariableNameInput}
                css={css`
                  flex: 1;
                  width: auto;
                  box-sizing: border-box;
                  min-width: 10px;
                  border: 0;
                  :focus {
                    outline: 0;
                  }
                `}
              />
            </div>
          </>
        );
      default:
        return (
          <>
            <span>{`点击${item.folderName}上的`}</span>
            <div
              css={css`
                height: 16px;
                line-height: 16px;
                border: 1px solid #e2e3ed;
              `}
            >
              <span className="selector-name">{item.targetSelector}</span>

              <SvgIcon SvgComponent={IconPicture} value={16} />
            </div>
          </>
        );
    }
  }, [
    handleChangeSelectorNameInput,
    handleChangeVariableNameInput,
    index,
    item.folderName,
    item.targetSelector,
    item.type,
    item.variable,
  ]);

  const handleClickStepItem = useCallback(() => {
    setCurrSelectedItem({ ...stepItems[index], index });
  }, [index, setCurrSelectedItem, stepItems]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleClickStepItem();
      }
    },
    [handleClickStepItem]
  );

  return (
    <div
      key={index}
      onClick={handleClickStepItem}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={index}
      css={css`
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        height: 52px;
        background: ${currSelectedItem?.index === index
          ? '#E6EAF2'
          : '#FFFFFF'};
        padding: 8px 12px 8px 8px;
        .step-item-title {
          height: 16px;
          line-height: 16px;
        }
        .step-item-action {
          height: 16px;
          line-height: 16px;
        }
      `}
    >
      <div
        css={css`
          display: flex;
          flex: 1;
          justify-content: space-between;
          margin-bottom: 12px;
        `}
      >
        <div className="step-item-title">
          <SvgIcon SvgComponent={titleInfo.icon} value={16} />
          <span
            css={css`
              font-family: 'Microsoft YaHei';
              font-style: normal;
              font-weight: 400;
              font-size: 14px;
              /* identical to box height, or 100% */
              color: #3e434d;
              margin-left: 8px;
            `}
          >
            {titleInfo.title}
          </span>
        </div>
        <div className="step-item-action">
          <Space size={8}>
            <Button
              type="text"
              onClick={handleClickLocate}
              css={css`
                height: 18px;
              `}
            >
              <SvgIcon SvgComponent={IconLocate} value={16} />
            </Button>
            <Button
              type="text"
              onClick={handleClickDelete}
              css={css`
                height: 18px;
              `}
            >
              <SvgIcon SvgComponent={IconDelete} value={16} />
            </Button>
          </Space>
        </div>
      </div>

      <div
        css={css`
          display: flex;
          flex: 0 0 auto;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          span {
            margin: 0px 5px;
            color: #898989;
          }
          .selector-name {
            color: #457ae6;
            max-width: 70px;
          }
          .variable-name {
            color: #ff8a00;
          }
        `}
      >
        {descriptionContent}
      </div>
    </div>
  );
});
