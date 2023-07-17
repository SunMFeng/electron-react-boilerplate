/** @jsxImportSource @emotion/react */
import { StepItem } from '@/models/StepList';
import { css } from '@emotion/react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as IconClick } from '@/assets/imgs/icon-click.svg';
import { ReactComponent as IconDelete } from '@/assets/imgs/icon-delete.svg';
// import { ReactComponent as IconLocate } from '@/assets/imgs/icon-locate.svg';
import { ReactComponent as IconPicture } from '@/assets/imgs/icon-picture.svg';
import SvgIcon from '@/pages/components/SvgIcon';
import { Popover, Space } from 'antd';
import Button from '@/pages/components/Button';
import { useSmartStepListStore } from '@/store/smartMode/stepList';
import { isEqual } from 'lodash-es';
import { findKeyBySelectorName } from '@/pages/normalModeContentArea/SelectorTree';
import { useSelectorStore } from '@/store/selectorStore';

interface StepItemContentProps {
  index: number; // StepItem序列顺序号;
  item: StepItem;
}

export const StepItemContent = memo((props: StepItemContentProps) => {
  const { index: indexProps, item: itemProps } = props;
  const selectors = useSelectorStore((state) => state.selectors);
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
  const setNameByIndex = useSelectorStore((state) => state.setNameByIndex);

  const [item, setItem] = useState(itemProps);
  const [index, setIndex] = useState(indexProps);
  const [newName, setNewName] = useState<string | null>(null);

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

  const handleClickStepItem = useCallback(() => {
    setCurrSelectedItem({ ...stepItems[index], index });
  }, [index, setCurrSelectedItem, stepItems]);

  //   const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
  //     (event) => {
  //       if (event.key === 'Enter') {
  //         handleClickStepItem();
  //       }
  //     },
  //     [handleClickStepItem]
  //   );

  const setNewSelectorNameInStepItem = useCallback(
    (name: string) => {
      if (currSelectedItem) {
        const key = findKeyBySelectorName(selectors, currSelectedItem)?.[0];
        if (key) {
          setNameByIndex({ index: key.toString(), name });
        }
      }
    },
    [currSelectedItem, selectors, setNameByIndex]
  );

  const handleBlurVariableNameInput = useCallback(() => {
    setStepItemByIndex({
      index,
      item: {
        ...item,
        variable: newName,
      },
    });
  }, [index, item, newName, setStepItemByIndex]);

  const handleEnterVariableNameInput: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        if (newName && e.key === 'Enter') {
          handleBlurVariableNameInput();
          handleClickStepItem();
        }
      },
      [handleBlurVariableNameInput, handleClickStepItem, newName]
    );

  const handleChangeNameInput: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setNewName(e?.target?.value);
    }, []);

  const handleBlurSelectorNameInput = useCallback(() => {
    let _item = { ...item };

    if (newName) {
      setNewSelectorNameInStepItem(newName);

      setStepItemByIndex({
        index,
        item: {
          ...item,
          targetSelector: newName,
        },
      });

      _item = {
        ...item,
        targetSelector: newName,
      };
    }

    return _item;
  }, [newName, setNewSelectorNameInStepItem, setStepItemByIndex, index, item]);

  const handleEnterSelectorNameInput: React.KeyboardEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        if (newName && e.key === 'Enter') {
          const _item = handleBlurSelectorNameInput();
          setCurrSelectedItem({ index, ..._item });
        }
      },
      [handleBlurSelectorNameInput, index, newName, setCurrSelectedItem]
    );

  // const handleClickLocate = useCallback(() => {
  //   // todo
  //   console.log('handleClickLocate');
  // }, []);

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
        selectorInputElement.value.length * 8
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
        (variableInputElement?.value?.length ?? 0) * 8
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
        selectorInputElement.value.length * 8
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
        (variableInputElement?.value?.length ?? 0) * 8
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
            <span
              css={css`
                max-width: 150px;
                display: flex;
                flex: 0 0 auto;
                white-space: nowrap;
              `}
            >
              点击
              <Popover content={item.folderName}>
                <span
                  css={css`
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                  `}
                >
                  {item.folderName}
                </span>
              </Popover>
              上的
            </span>
            <Popover
              content={
                <img
                  src={item.screenshot}
                  alt="selector-preview"
                  style={{ maxWidth: `250px`, height: `auto` }}
                />
              }
            >
              <div
                css={css`
                  height: 16px;
                  line-height: 16px;
                  border: 1px solid #e2e3ed;
                  padding: 1px 8px;
                  background-color: #ffffff;
                `}
              >
                {/* <span className="selector-name">{item.targetSelector}</span> */}
                <input
                  key={`selector-name-area: ${index}`}
                  type="text"
                  className="selector-name"
                  id={`selector-editable-input-${index}`}
                  defaultValue={item.targetSelector}
                  onChange={handleChangeNameInput}
                  onKeyDown={handleEnterSelectorNameInput}
                  onBlur={handleBlurSelectorNameInput}
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

                <SvgIcon SvgComponent={IconPicture} value={16} />
              </div>{' '}
            </Popover>
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
                key={`selector-name-area: ${index}`}
                type="text"
                className="selector-name"
                id={`selector-editable-input-${index}`}
                defaultValue={item.targetSelector}
                onChange={handleChangeNameInput}
                onKeyDown={handleEnterSelectorNameInput}
                onBlur={handleBlurSelectorNameInput}
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
                key={`variable-name-area: ${index}`}
                type="text"
                className="variable-name"
                id={`variable-editable-input-${index}`}
                defaultValue={item.variable}
                onChange={handleChangeNameInput}
                onKeyDown={handleEnterVariableNameInput}
                onBlur={handleBlurVariableNameInput}
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
              <Popover
                content={
                  <img
                    src={item.screenshot}
                    alt="selector-preview"
                    css={css`
                      maxwidth: 300px;
                    `}
                  />
                }
              >
                <SvgIcon SvgComponent={IconPicture} value={16} />
              </Popover>
            </div>
          </>
        );
    }
  }, [
    handleBlurSelectorNameInput,
    handleBlurVariableNameInput,
    handleChangeNameInput,
    handleEnterSelectorNameInput,
    handleEnterVariableNameInput,
    index,
    item.folderName,
    item.screenshot,
    item.targetSelector,
    item.type,
    item.variable,
  ]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      key={index}
      onClick={handleClickStepItem}
      //   onKeyDown={handleKeyDown}
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
            {/* <Button
              type="text"
              onClick={handleClickLocate}
              css={css`
                height: 18px;
              `}
            >
              <SvgIcon SvgComponent={IconLocate} value={16} />
            </Button> */}
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
