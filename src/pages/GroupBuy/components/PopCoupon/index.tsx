import BgdPng from '@/assets/GroupBuy/pop-bgd.png';
import { Button } from 'react-vant';
import React, { useState } from 'react';
import './index.less';

export type P = {
  children: React.ReactElement;
  overlayProps?: any;
  data: any;
};

export default ({ children, overlayProps, data }: P) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          console.log(data);
          setVisible(true);
        },
      })}
      {visible && (
        <div className="pop-coupon">
          <div
            onClick={() => setVisible(false)}
            className="pop-coupon__overlay"
            {...overlayProps}
          />
          <div className="pop-coupon__container">
            <img src={BgdPng} />
            <p className="pop-coupon__container__p">
              已领取“2-3人100元代金券”团购抵用券，下单前记得勾选抵用券哦
            </p>
            <Button className="pop-coupon__container__button" type="primary">
              现在下单，立省60元
            </Button>
            <p className="pop-coupon__container__p">
              券有效期<span className="high">剩余5天</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
