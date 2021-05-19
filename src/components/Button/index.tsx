import { useCallback } from 'react';
import { ReactComponent as Loader } from '../Toast/loading.svg';
import cn from 'classnames';
import './button.less';

interface ButtonProps {
  size?: 'normal' | 'small' | 'large' | 'mini';
  type?: 'default' | 'primary';
  block?: boolean;
  loading?: boolean;
  round?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

export default ({
  children,
  loading,
  block,
  round,
  size = 'normal',
  type = 'default',
  className,
  style,
  disabled,
  onClick,
}: ButtonProps) => {
  const cls = cn('local-button', `local-button--${size}`, `local-button--${type}`, className, {
    'local-button--round': round,
    'local-button--disabled': disabled,
    'local-button--loading': loading,
    block,
  });

  const handleClick = useCallback(() => {
    if (onClick && !loading && !disabled) onClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div className={cls} onClick={handleClick} style={style}>
      <div className="local-button__content">
        {loading && <Loader className="local-button__loader" />}
        {children}
      </div>
    </div>
  );
};
