import { Flex } from 'react-vant';
import { Button } from 'react-vant';
import ShopPng from '@/assets/GroupBuy/shop.png';
import './index.less';

export default () => {
  return (
    <Flex className="product">
      <img
        className="product__img"
        src="https://img.jinse.com/5467970_small.png"
      />
      <div className="product__body">
        <p className="product__title">价值200元代金券限量兑换</p>
        <Flex align="center" justify="between">
          <Flex align="center">
            <img className="product__logo" src={ShopPng} />
            <p className="gray">五芳斋（向往街店）</p>
          </Flex>
          <span className="gray">1.5km</span>
        </Flex>
        <Flex align="center" className="score">
          <p className="primery">4.8分</p>
          <p className="gray1">热销4322</p>
        </Flex>
        <Flex justify="between" align="center">
          <div>
            <p className="gray-small">门市价¥239</p>
            <p className="primery-blod">
              到手价¥<span className="primery-big">109.64</span>
            </p>
          </div>
          <Button className="product__body--primery" type="danger">
            领券省钱
          </Button>
        </Flex>
      </div>
    </Flex>
  );
};
