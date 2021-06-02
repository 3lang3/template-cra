import { Down, Up, Left, Right } from '@icon-park/react';
import cn from 'classnames';
import './list.less';

const iconDefaultProps = {
  strokeWidth: 3,
  theme: 'outline',
} as any;

type ListProps = {
  /**
   * 列表分组标题
   */
  title?: string | React.ReactNode;
  /**
   * 是否显示外边框
   * @default true
   */
  border?: boolean;
  children: React.ReactNode;
};

export const List = ({ children, title, border = true }: ListProps) => {
  return (
    <div className={cn('local-list', { 'hairline--top-bottom': border })}>
      {title ? <div className="local-list__title">{title}</div> : null}
      {children}
    </div>
  );
};

type ListItemProps = {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  border?: boolean;
  required?: boolean;
  center?: boolean;
  arrowDirection?: boolean | 'left' | 'right' | 'up' | 'down';
  children: React.ReactNode;
  className?: string;
};

export const ListItem = (props: ListItemProps) => {
  const {
    title,
    description,
    arrowDirection,
    icon,
    required,
    center,
    border = true,
    children,
    className,
  } = props;

  const renderArrow = () => {
    if (!arrowDirection) return null;
    let ct: any = <Right {...iconDefaultProps} />;
    if (arrowDirection === 'down') ct = <Down theme="outline" {...iconDefaultProps} />;
    if (arrowDirection === 'up') ct = <Up theme="outline" {...iconDefaultProps} />;
    if (arrowDirection === 'left') ct = <Left theme="outline" {...iconDefaultProps} />;
    return <div className="local-list-item__right-icon">{ct}</div>;
  };
  const renderTitle = () => {
    if (!title && !description) return null;
    return (
      <div className="local-list-item__title">
        {title ? <span>{title}</span> : null}
        {description ? <div className="local-list-item__desc">{description}</div> : null}
      </div>
    );
  };
  return (
    <div
      className={cn('local-list-item', className, {
        'local-list-item--noborder': !border,
        'local-list-item--required': required,
        'local-list-item--center': center,
      })}
    >
      {icon ? <div className="local-list-item__left-icon">{icon}</div> : null}
      {renderTitle()}
      <div className="local-list-item__content">{children}</div>
      {renderArrow()}
    </div>
  );
};

List.Item = ListItem;
