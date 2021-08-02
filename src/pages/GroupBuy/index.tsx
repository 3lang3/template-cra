import { useState } from 'react';
import { useRequest } from 'ahooks';
import { categories, regions, shops } from '@/services/groupBuy';
import Search from './components/Search';
import TabBar from './components/TabBar';
import Menu from './components/Menu';
import Product from './components/Product';
import './index.less';

export default () => {
  const [tabBarList, setTabBarList] = useState([]);
  const [regionsList, setRegionsList] = useState<any>([[], [], []]);
  useRequest(categories, {
    onSuccess: ({ data }) => {
      setTabBarList(data.map((item) => ({ label: item.name, value: item.id })));
    },
  });

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

  useRequest(shops, {
    onSuccess: ({ data }) => {
      regionsList[1] = data.map((item) => ({
        label: item.name,
        value: item.id,
        ...item,
      }));
      setRegionsList(regionsList);
    },
  });

  return (
    <div className="buy">
      <header className="buy__header">
        <Search />
        <TabBar data={tabBarList} />
      </header>
      <div className="buy__body">
        <Menu list={regionsList} />
        <div className="buy__body--list">
          <Product />
          <Product />
        </div>
      </div>
    </div>
  );
};
