/* eslint-disable @typescript-eslint/no-use-before-define */
import { parse } from 'querystring';
import { getClaimOrder, memberClaimOrder } from './services';
import { useRequest } from 'ahooks';
import * as React from 'react';
import { CustomSearch, CustomClaimDesc } from './components';
import styles from './index.less';
import { Toast, Empty, Image, Flex } from 'react-vant';

export default ({ location }) => {
  const { keyword } = parse(location.search.substr(1));
  const [value, set] = React.useState(() => ({ keyword }));
  const [disabled, setDisabled] = React.useState(false);

  const { data: { data } = { data: [] }, ...searchReq } = useRequest(
    getClaimOrder,
    { manual: true },
  );
  const confrimReq = useRequest(memberClaimOrder, { manual: true });

  React.useEffect(() => {
    if (value.keyword) {
      search(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const search = async (payload) => {
    try {
      Toast.loading({ message: '查询中...', duration: 0, forbidClick: true });
      const { type, msg } = await searchReq.run({
        parent_order_sn: payload.keyword,
      });
      Toast.clear();
      if (type === 1) throw new Error(msg);
    } catch (error) {
      Toast.info(error.message);
    }
  };

  const onSearch = async (v) => {
    if (!v) {
      Toast.info('输入框不能为空');
      return;
    }
    search(v);
  };

  const onConfirm = async () => {
    if (confrimReq.loading || disabled) return;
    try {
      Toast.loading('认领中...');
      const { type, msg } = await confrimReq.run({
        orderGoodsIds: data.map((el) => el.ids),
      });
      Toast.clear();
      if (type === 1) throw new Error(msg);
      setDisabled(true);
      Toast.info(msg);
    } catch (error) {
      Toast.info(error.message);
    }
  };
  return (
    <div className={styles.container}>
      {Array.isArray(data) && data.length ? (
        <>
          <div className={styles.products}>
            {data.map((el) => (
              <Flex className={styles.product} key={el.ids}>
                <div className={styles.imgWrapper}>
                  <div className={styles.platform}>{el.platform_name}</div>
                  <Image className={styles.img} src={el.goods_img} />
                </div>
                <Flex
                  direction="column"
                  justify="between"
                  className={styles.right}
                >
                  <div className={styles.info}>
                    <div className={styles.productName}>{el.goods_name}</div>
                    <div className={styles.sn}>订单号：{el.order_sn}</div>
                  </div>
                  <div className={styles.price}>¥{el.goods_price}</div>
                </Flex>
              </Flex>
            ))}
          </div>
          <Flex
            align="center"
            justify="center"
            className={`${styles.confirmBtn} ${
              disabled ? styles.disabled : ''
            }`}
            onClick={onConfirm}
          >
            确认领取
          </Flex>
        </>
      ) : (
        <>
          <div className={styles.bottom}>
            <CustomSearch
              value={value}
              onChange={(v) => set(v)}
              onSearch={onSearch}
            />
          </div>
          <div className={styles.empty}>
            <Empty image="search" />
          </div>
          <CustomClaimDesc />
        </>
      )}
    </div>
  );
};
