import { Flex } from 'react-vant';
import { useState, useEffect } from 'react';
import './index.less';

export default ({ data }) => {
  const [active, setActive] = useState(1);
  useEffect(() => {
    if (data.length) {
      setActive(data[0].value);
    }
  }, [data]);
  return (
    <Flex justify="between" className="navbar">
      {data.map((item) => (
        <p
          className={`navbar__p navbar__p${
            active === item.value && '--active'
          }`}
          key={item.value}
          onClick={() => setActive(item.value)}
        >
          {item.label}
        </p>
      ))}
    </Flex>
  );
};
