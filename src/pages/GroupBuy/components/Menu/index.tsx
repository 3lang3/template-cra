import { Flex } from 'react-vant';
import { useState } from 'react';
import './index.less';

const data = [
  {
    label: '全部商圈',
    value: 1,
  },
  {
    label: '全部餐饮',
    value: 2,
  },
  {
    label: '只能排序',
    value: 3,
  },
];

export default () => {
  return (
    <Flex align="center" className="menu">
      {data.map((item) => (
        <span className={`menu__span`} key={item.value}>
          {item.label}
        </span>
      ))}
    </Flex>
  );
};
