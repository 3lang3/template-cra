import GroupBuy from '@/assets/GroupBuy/search.png';
import { Flex } from 'react-vant';
import './index.less';

export default ({ readonly = false, onSearch = () => {} }) => {
  return (
    <div className="search-area">
      <Flex align="center" className="search-area__body">
        <Flex align="center" className="search-area__content">
          <img src={GroupBuy} />
          <input
            onClick={onSearch}
            readOnly={readonly}
            placeholder="搜索门店领取优惠券"
          />
        </Flex>
      </Flex>
      <span className="btn">搜索</span>
    </div>
  );
};
