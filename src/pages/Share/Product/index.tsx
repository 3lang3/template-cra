import { FullPageError, FullPageLoader } from '@/components/Chore';
import { useRequest } from 'ahooks';
import { getBrowserGoodsDetail } from './services';
import styles from './index.less';
import { Flex, Typography, Swipe } from 'react-vant';
import Image from '@/components/Image';
import dotSrc from './static/share_dot.png';
import andriodIconSrc from './static/share_browser_andriod.png';
import iosIconSrc from './static/share_browser_ios.png';
import { BROWSER_ENV } from '@/config/ua';

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

const CouponView = (props) => {
  return (
    <Flex direction="column" justify="between" className={styles.coupon}>
      <Flex align="end">
        <Typography.Text size="lg" type="primary">
          ¥{props.coupon_amount}
        </Typography.Text>
        <Typography.Text type="primary">{props.coupon_name}</Typography.Text>
      </Flex>
      <Typography.Text size="sm" type="secondary">
        有效期{props.coupon_time}
      </Typography.Text>
      <Flex justify="center" align="center" className={styles.coupon__btn}>
        立即领取
      </Flex>
    </Flex>
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
      <div className={styles.body}>
        <Flex align="center" justify="between">
          <Flex>
            <Typography.Text type="primary">
              到手价 ¥{detail.final_price}
            </Typography.Text>
            <Typography.Text delete type="secondary">
              ¥{detail.reserve_price}
            </Typography.Text>
          </Flex>
          <Typography.Text type="secondary">
            已有 {detail.csale}人购买
          </Typography.Text>
        </Flex>
        <Typography.Title ellipsis={2} className={styles.title}>
          {detail.title}
        </Typography.Title>

        <CouponView {...detail} />
      </div>
    </div>
  );
};
