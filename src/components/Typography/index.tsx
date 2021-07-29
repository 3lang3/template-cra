import cls from 'classnames';
import styles from './index.less';

type TypographyProps = {
  center?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  ellipsis?: boolean | number;
};

type TextProps = {
  type?: 'default' | 'danger' | 'secondary' | 'light' | 'primary' | 'success';
  size?: 'md' | 'sm' | 'xs' | 'lg' | 'xl' | 'xxl';
  strong?: boolean;
  children?: React.ReactNode | string;
} & TypographyProps;

const Text = ({
  type = 'default',
  size = 'md',
  center,
  ellipsis,
  className,
  children,
  strong,
  ...props
}: TextProps) => {
  const elli = ellipsis === true ? 1 : ellipsis;
  return (
    <div
      className={cls(
        styles['typography__text'],
        styles[`typography__text--${type}`],
        styles[`typography__text--${size}`],
        className,
        {
          'rv-ellipsis': elli === 1,
          [`rv-multi-ellipsis--l${elli}`]: elli && elli > 1,
          [styles['text-strong']]: strong,
          [styles['text-center']]: center,
        },
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type TitleProps = {
  /**
   *
   */
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode | string;
  type?: 'default' | 'danger' | 'secondary' | 'light' | 'primary';
} & TypographyProps;
const Title = ({
  level = 4,
  center,
  className,
  type,
  ellipsis,
  children,
  ...props
}: TitleProps) => {
  const elli = ellipsis === true ? 1 : ellipsis;
  return (
    <div
      className={cls(
        styles['typography__title'],
        styles[`typography__title--${type}`],
        styles[`typography__title--h${level}`],
        className,
        {
          'rv-ellipsis': elli === 1,
          [`rv-multi-ellipsis--l${elli}`]: elli && elli > 1,
          [styles['text-center']]: center,
        },
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type LinkProps = {
  size?: 'md' | 'sm' | 'xs' | 'lg' | 'xl' | 'xxl';
  children: React.ReactNode | string;
} & TypographyProps;
const Link = ({
  className,
  center,
  size = 'md',
  ellipsis,
  children,
  ...props
}: LinkProps) => {
  const elli = ellipsis === true ? 1 : ellipsis;
  return (
    <div
      className={cls(
        styles['typography__link'],
        styles[`typography__link--${size}`],
        className,
        {
          'rv-ellipsis': elli === 1,
          [`rv-multi-ellipsis--l${elli}`]: elli && elli > 1,
          [styles['text-center']]: center,
        },
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const Typography = {
  Text,
  Title,
  Link,
};

export default Typography;
