import cls from 'classnames';
import styles from './index.less';

type PriceProps = {
  /** 价格 */
  content: string;
  /** 钱标识符 @default ¥ */
  symbol?: boolean | string;
  /** 尺寸大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 类型 */
  type?: 'primary' | 'secondary';
  /** 是否有贯穿线 */
  delete?: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
};

const Price: React.FC<PriceProps> = (props) => {
  const { content, symbol = '¥', size = 'md', type } = props;
  const [int, float] = content.split('.');
  const hasDot = +float > 0;

  const renderSymbol = () => {
    if (!symbol) return null;
    return <span className={styles.price__symbol}>{symbol}</span>;
  };
  const renderInt = () => {
    return (
      <span className={styles.price__int}>{`${int}${hasDot ? '.' : ''}`}</span>
    );
  };
  const renderFloat = () => {
    if (!hasDot) return null;
    return <span className={styles.price__float}>{float}</span>;
  };
  return (
    <div
      style={props.style}
      className={cls(styles.price, props.className, {
        [styles[`price__${size}`]]: size,
        [styles[`price__${type}`]]: type,
        [styles[`price__delete`]]: props.delete,
      })}
      onClick={props.onClick}
    >
      {renderSymbol()}
      {renderInt()}
      {renderFloat()}
    </div>
  );
};

export default Price;
