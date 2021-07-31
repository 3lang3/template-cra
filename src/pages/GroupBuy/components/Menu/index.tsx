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
  const [active, setActive] = useState(1);
  return (
    <Flex justify="between" align="center" className="menu">
      {data.map((item) => (
        <span
          className={`menu__span ${
            active === item.value && 'menu__span--active'
          }`}
          key={item.value}
          onClick={() => setActive(item.value)}
        >
          {item.label}
        </span>
      ))}
    </Flex>
  );
};
