import { useState, useEffect, Fragment } from 'react';
import { useRequest } from 'ahooks';
import { categories, regions, deals } from '@/services/groupBuy';
import MoreList from './components/MoreList';
import SearchBtn from './components/SearchBtn';
import Menu from './components/Menu';
import Product from './components/Product';
import './search.less';

export default () => {
  const [tabBarList, setTabBarList] = useState([]);
  const [regionsList, setRegionsList] = useState<any>([[], [], []]);

  const { run } = useRequest(categories, {
    manual: true,
    onSuccess: ({ data }) => {
      regionsList[1] = data.map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }));
    },
  });

  useEffect(() => {
    run({ plat: 2, pid: 226 });
  }, []);

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

  const { run: dealsRun } = useRequest(deals, {
    manual: true,
  });

  // 领券
  function onReceive(node) {
    console.log(node);
  }

  return (
    <div className="buy-search">
      <header className="buy-search__header">
        <SearchBtn />
      </header>
      <div className="buy-search__body">
        <Menu list={regionsList} />
        <div className="buy-search__body--list">
          <MoreList
            request={dealsRun}
            row={(item, i) => (
              <Fragment key={'item-' + i}>
                <Product data={item} onReceive={onReceive} />
              </Fragment>
            )}
          />
        </div>
      </div>
    </div>
  );
};
