import { memo, useMemo } from 'react';

export interface SvgIconProps {
  className?: string;
  SvgComponent?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  size?: 'small' | 'medium' | 'large';
  value?: number | { width: number; height: number };
}

export default memo(function SvgIcon(props: SvgIconProps) {
  const { className, SvgComponent, size, value = 12 } = props;

  const _size: number = useMemo(() => {
    let _value = 24;
    switch (size) {
      case 'small':
        _value = 16;
        break;
      case 'medium':
        _value = 24;
        break;
      case 'large':
        _value = 30;
        break;
      default:
        break;
    }
    return _value;
  }, [size]);

  return SvgComponent ? (
    <SvgComponent
      fill="currentColor"
      fontSize="inherit"
      width={(typeof value === 'number' ? value : value.width) ?? _size}
      height={(typeof value === 'number' ? value : value.height) ?? _size}
      className={className}
    />
  ) : null;
});
