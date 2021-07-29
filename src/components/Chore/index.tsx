// UI杂项
import { Button, Empty, Flex, Loading } from 'react-vant';
import styles from './index.less';

type FullPageBaseProps = {
  description?: string;
};

type FullPageLoaderProps = {
  /** 自定义loader颜色 */
  color?: string;
} & FullPageBaseProps;
export const FullPageLoader = ({
  color = '#f44336',
  description,
}: FullPageLoaderProps) => {
  return (
    <Flex
      className="full-page bg-white"
      direction="column"
      justify="center"
      align="center"
    >
      <Loading color={color} vertical>
        {description}
      </Loading>
    </Flex>
  );
};

type FullPageErrorProps = {
  /** 刷新按钮调用方法 */
  refresh?: () => void;
} & FullPageBaseProps;
export const FullPageError = ({
  description = '服务器出了点问题',
  refresh,
}: FullPageErrorProps) => {
  return (
    <Flex
      className="full-page bg-white"
      direction="column"
      justify="center"
      align="center"
    >
      <Empty image="error" description={description} />
      {refresh ? (
        <Button
          className={styles.refresh__btn}
          type="primary"
          onClick={refresh}
        >
          刷 新
        </Button>
      ) : null}
    </Flex>
  );
};
