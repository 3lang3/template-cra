import { Flex } from 'react-vant';
import { Button } from 'react-vant';
import ShopPng from '@/assets/GroupBuy/shop.png';
import PopCoupon from '../PopCoupon';
import './index.less';

export default ({ data, onReceive }) => {
  return (
    <Flex className="product">
      <img className="product__img" src={data.dealInfo.defaultPic} />
      <div className="product__body">
        <p className="product__title ellipsis">{data.dealInfo.dealTitle}</p>
        <Flex align="center" justify="between">
          <Flex align="center">
            <img className="product__logo" src={ShopPng} />
            <p className="gray ellipsis">{data.shopInfo.shopName}</p>
          </Flex>
          <span className="gray">{data.shopInfo.distance / 1000}km</span>
        </Flex>
        <Flex align="center" className="score">
          <p className="primery">{data.shopInfo.shopPower}分</p>
          <p className="gray1">热销{data.dealInfo.halfYearSale}</p>
        </Flex>
        <Flex justify="between" align="center">
          <div>
            <p className="gray-small">门市价¥{data.dealInfo.marketPrice}</p>
            <p className="primery-blod">
              到手价¥
              <span className="primery-big">{data.dealInfo.finalPrice}</span>
            </p>
          </div>
          <PopCoupon data={data}>
            <Button
              className="product__body--primery"
              onClick={() => onReceive(data)}
              type="danger"
            >
              领券省钱
            </Button>
          </PopCoupon>
        </Flex>
      </div>
    </Flex>
  );
};
