import * as React from 'react';
import { history } from 'umi';
import { Swipe, Toast } from 'react-vant';
import stepTbOneSrc from './static/demo_1.jpg';
import stepTbTwoSrc from './static/demo_2.jpg';
import stepPddOneSrc from './static/demo_pdd_1.jpg';
import stepPddTwoSrc from './static/demo_pdd_2.jpg';
import styles from './index.less';
import { CustomClaimDesc, CustomSearch, SwiperContentItem } from './components';

export default () => {
  const [payload, set] = React.useState({ keyword: '' });

  const onSearch = async () => {
    if (!payload.keyword) {
      Toast.info('输入框不能为空');
      return;
    }
    history.push(`/a/order/claim/result?keyword=${payload.keyword}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CustomSearch
          value={payload}
          onChange={(v) => {
            set(v);
          }}
          onSearch={onSearch}
        />
      </div>

      <div className={styles.padd}>
        <div className={styles.lightBox}>
          <Swipe className={styles.swiper} autoplay="5000">
            <Swipe.Item>
              <SwiperContentItem
                brand="淘宝"
                subTitle="我的淘宝-查看全部订单"
                img1={stepTbOneSrc}
                img2={stepTbTwoSrc}
              />
            </Swipe.Item>
            <Swipe.Item>
              <SwiperContentItem
                brand="拼多多"
                subTitle="个人中心-查看全部订单"
                img1={stepPddOneSrc}
                img2={stepPddTwoSrc}
              />
            </Swipe.Item>
          </Swipe>
        </div>
      </div>
      <CustomClaimDesc />
    </div>
  );
};
