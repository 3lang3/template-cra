import { useState } from 'react';
import { useRequest } from 'ahooks';
import { categories } from '@/services/groupBuy';
import Search from './components/Search';
import TabBar from './components/TabBar';
import Menu from './components/Menu';
import Product from './components/Product';
import './index.less';

export default () => {
  const [tabBarList, setTabBarList] = useState([]);
  useRequest(categories, {
    onSuccess: ({ data }) => {
      setTabBarList(data.map((item) => ({ label: item.name, value: item.id })));
    },
  });
  return (
    <div className="buy">
      <header className="buy__header">
        <Search />
        <TabBar data={tabBarList} />
      </header>
      <div className="buy__body">
        <Menu />
        <div className="buy__body--list">
          <Product />
          <Product />
        </div>
      </div>
    </div>
  );
};
