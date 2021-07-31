import { Flex } from 'react-vant';
import { useState } from 'react';
import './index.less';

const data = [
  { label: '美食', value: 1 },
  { label: '丽人/美发', value: 2 },
  { label: '休闲娱乐', value: 3 },
  { label: '亲子', value: 4 },
];

export default () => {
  const [active, setActive] = useState(1);
  return (
    <Flex justify="between" className="navbar">
      {data.map((item) => (
        <p
          className={`navbar__p navbar__p${
            active === item.value && '--active'
          }`}
          key={item.label}
          onClick={() => setActive(item.value)}
        >
          {item.label}
        </p>
      ))}
    </Flex>
  );
};
