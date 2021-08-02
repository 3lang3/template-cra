import { useState } from 'react';
import { useRequest } from 'ahooks';
import { regions, deals } from '@/services/groupBuy';
import Search from './components/Search';
import Menu from './components/Menu';
import Product from './components/Product';
import './search.less';

export default () => {
  const [regionsList, setRegionsList] = useState<any>([[], [], []]);

  useRequest(regions, {
    onSuccess: ({ data }) => {
      regionsList[0] = data.map((item) => ({
        label: item.name,
        value: item.id,
        children: item.circles,
        ...item,
      }));
      regionsList[2] = [
        {
          label: '离我最近',
          value: 1,
        },
        {
          label: '销量最高',
          value: 6,
        },
        {
          label: '销量最低',
          value: 7,
        },
        {
          label: '价格由低到高',
          value: 8,
        },
        {
          label: '价格由高到低',
          value: 9,
        },
      ];
      setRegionsList(regionsList);
    },
  });

  useRequest(deals, {
    onSuccess: (res) => {
      console.log(res);
    },
  });

  return (
    <div className="buy">
      <header className="buy__header">
        <Search />
      </header>
      <div className="buy__body">
        <Menu list={regionsList} />
        <div className="buy__body--list">
          {/* <Product /> */}
          {/* <Product /> */}
        </div>
      </div>
    </div>
  );
};
