// UI杂项
import { MESSAGE_MAP } from '@/config/constant';
import { Button, Empty, Flex, Loading } from 'react-vant';

import styles from './index.less';

type FullPageBaseProps = {
  description?: string;
};

type FullPageLoaderProps = {
  /** 自定义loader颜色 */
  color?: string;
} & FullPageBaseProps;
/** 页面加载loader */
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
/** 页面加载错误UI */
export const FullPageError = ({
  description = MESSAGE_MAP.ERROR,
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

/** 列表加载loader */
export const ListLoader = () => (
  <Flex className="p-default" justify="center">
    <Loading />
  </Flex>
);
/** 列表空状态UI */
export const ListEmpty = ({ description = MESSAGE_MAP.EMPTY }) => (
  <Flex className="p-default" justify="center">
    <Empty description={description} />
  </Flex>
);
/** 列表加载完文案UI */
export const ListDone = ({ message = MESSAGE_MAP.LIST_DONE }) => (
  <Flex className="p-default secondary" justify="center" align="center">
    {message}
  </Flex>
);
/** 列表加载错误UI */
export const ListError = ({ description = MESSAGE_MAP.ERROR }) => (
  <Flex className="p-default" justify="center">
    <Empty image="error" description={description} />
  </Flex>
);
