import GroupBuy from '@/assets/GroupBuy/search.png';
import { Flex } from 'react-vant';
import './index.less';

export default () => {
  return (
    <Flex align="center" className="search">
      <span className="search__span--triangle">杭州市</span>
      <Flex align="center" className="search__content">
        <img src={GroupBuy} />
        <input placeholder="搜索门店领取优惠券" />
      </Flex>
    </Flex>
  );
};
