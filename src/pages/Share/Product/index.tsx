import cls from 'classnames';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import { useRequest } from 'ahooks';
import { getBrowserGoodsDetail } from './services';
import { Flex, Typography, Swipe } from 'react-vant';
import Image from '@/components/Image';
import dotSrc from './static/share_dot.png';
import andriodIconSrc from './static/share_browser_andriod.png';
import iosIconSrc from './static/share_browser_ios.png';
import { BROWSER_ENV } from '@/config/ua';
import Price from '@/components/Price';
import styles from './index.less';
import { useCallback } from 'react';
import app from '@/utils/app';

export default ({ location }) => {
  const { query } = location;
  const {
    loading,
    error,
    refresh,
    data: { data: detail } = { data: {} },
  } = useRequest(getBrowserGoodsDetail, {
    defaultParams: [{ item_id: query.item_id }],
    onSuccess: ({ data }) => {
      document.title = data.title;
    },
  });

  // 唤起app
  const open = () => {
    app.call.goodsDetail({
      goods_ids: detail.ids,
      item_id: detail.item_id,
      page_type: detail.user_type,
    });
  };

  const renderShare = useCallback(() => {
    if (!BROWSER_ENV.WECHAT) return null;
    return (
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
    );
  }, []);

  const renderSwipe = useCallback(() => {
    const imgs =
      Array.isArray(detail.small_images) && detail.small_images
        ? detail.small_images
        : [detail.img];
    return (
      <Swipe
        className={styles.swipe}
        indicatorRender={({ current, count }) => (
          <Flex
            justify="center"
            align="center"
            className={styles.swipe__indicator}
          >
            {current}/{count}
          </Flex>
        )}
      >
        {imgs.map((el, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Swipe.Item key={i}>
            <Image src={el} />
          </Swipe.Item>
        ))}
      </Swipe>
    );
  }, [detail.img, detail.small_images]);

  const renderTitle = useCallback(() => {
    return (
      <Typography.Title
        ellipsis={2}
        className={cls(styles.title, styles[`platform_${+detail.user_type}`])}
      >
        {detail.title}
      </Typography.Title>
    );
  }, [detail.title, detail.user_type]);

  const renderPrice = useCallback(() => {
    return (
      <>
        <Typography.Text type="primary">到手价</Typography.Text>
        <Price
          className="ml10 mr20"
          content={detail.final_price}
          type="primary"
          size="lg"
        />
      </>
    );
  }, [detail.final_price]);

  const renderReservePrice = useCallback(() => {
    return <Price content={detail.reserve_price} type="secondary" delete />;
  }, [detail.reserve_price]);

  const renderCoupon = useCallback(() => {
    if (BROWSER_ENV.WECHAT) return null;
    if (!+detail.coupon_amount)
      return <div onClick={open} className={styles.coupon__empty} />;
    return (
      <Flex
        onClick={open}
        direction="column"
        justify={+detail.coupon_amount ? 'between' : 'center'}
        className={styles.coupon}
      >
        <Flex align="end">
          <Price
            className="mr10"
            content={detail.coupon_amount}
            size="lg"
            type="primary"
          />
          <Typography.Text strong type="primary">
            {detail.coupon_name}
          </Typography.Text>
        </Flex>
        <Typography.Text size="sm">有效期{detail.coupon_time}</Typography.Text>

        <Flex justify="center" align="center" className={styles.coupon__btn}>
          立即领取
        </Flex>
      </Flex>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.ids]);

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;

  return (
    <div className={styles.container}>
      {renderShare()}
      {renderSwipe()}
      <div className={styles.body}>
        {!BROWSER_ENV.WECHAT && (
          <Flex align="center" justify="between">
            <Flex align="baseline">
              {renderPrice()}
              {renderReservePrice()}
            </Flex>
            <Typography.Text type="secondary">
              已有{detail.csale}人购买
            </Typography.Text>
          </Flex>
        )}
        {renderTitle()}
        {BROWSER_ENV.WECHAT ? (
          <>
            <Flex className="mb20" align="center" justify="between">
              {renderReservePrice()}
              {+detail.coupon_amount > 0 && (
                <Flex
                  className={styles.coupon__tag}
                  align="center"
                  justify="center"
                >
                  券 ¥{+detail.coupon_amount}
                </Flex>
              )}
            </Flex>
            {renderPrice()}
          </>
        ) : (
          renderCoupon()
        )}
      </div>
    </div>
  );
};
