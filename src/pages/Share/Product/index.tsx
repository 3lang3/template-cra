import { FullPageError, FullPageLoader } from '@/components/Chore';
import { useRequest } from 'ahooks';
import { getBrowserGoodsDetail } from './services';
import styles from './index.less';
import { Flex, Swipe } from 'react-vant';
import Image from '@/components/Image';
import dotSrc from './static/share_dot.png';
import andriodIconSrc from './static/share_browser_andriod.png';
import iosIconSrc from './static/share_browser_ios.png';
import { BROWSER_ENV } from '@/config/ua';
import Typography from '@/components/Typography';

const ProductSwipe = ({ detail }) => {
  const imgs =
    Array.isArray(detail.small_images) && detail.small_images
      ? detail.small_images
      : [detail.img];
  return (
    <Swipe className={styles.swipe}>
      {imgs.map((el, i) => (
        <Swipe.Item key={i}>
          <Image className={styles.swipe__img} src={el} />
        </Swipe.Item>
      ))}
    </Swipe>
  );
};

export default ({ location }) => {
  const { query } = location;
  const {
    loading,
    error,
    refresh,
    data: { data: detail } = { data: {} },
  } = useRequest(getBrowserGoodsDetail, {
    defaultParams: [{ item_id: query.item_id }],
  });

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;
  console.log(detail);
  return (
    <div className={styles.container}>
      <Flex direction="column" justify="between" className={styles.share}>
        <div className={styles.share__arrow} />
        <Flex className={styles.share__item} align="center">
          点击右上角
          <img src={dotSrc} />
        </Flex>
        <Flex className={styles.share__item} align="center">
          选择浏览器
          <img src={BROWSER_ENV.ANDROID ? andriodIconSrc : iosIconSrc} />
          打开
        </Flex>
      </Flex>
      <ProductSwipe detail={detail} />
      <Typography.Title level={3} ellipsis={2} className={styles.title}>
        {detail.title}
      </Typography.Title>
    </div>
  );
};
