import { meituanCities } from '@/services/groupBuy';
import { useRequest } from 'ahooks';
import { Fragment, useState } from 'react';
import { IndexBar, Cell } from 'react-vant';
import SearchArea from './components/SearchBtn';
import './area.less';

export type Node = {
  id: number;
  index: string;
  level: number;
  name: string;
  pinyin: string;
  plat: number;
};

export default () => {
  const [cities, setCities] = useState<any>([]);
  const [hotCities, setHotCities] = useState<Node[]>([]);
  const [userCity, setUserCity] = useState<Node>(null as any);
  useRequest(meituanCities, {
    onSuccess: ({ data }) => {
      setCities(data.cities);
      setHotCities(data.hot_cities);
      setUserCity(data.user_city);
    },
  });
  return (
    <div className="area">
      <SearchArea />
      {userCity && (
        <p className="area__head">
          {userCity.name}
          <span>GPS定位</span>
        </p>
      )}
      <div>
        <IndexBar.Anchor index="热门城市" />
        <div>
          {hotCities.map((item) => (
            <span className="area__span">{item.name}</span>
          ))}
        </div>
      </div>
      <IndexBar>
        {Object.keys(cities).map((key, i) => (
          <Fragment key={'key-' + i}>
            <IndexBar.Anchor index={key} />
            {cities[key].map((item) => (
              <Cell key={item.id} title={item.name} />
            ))}
          </Fragment>
        ))}
      </IndexBar>
    </div>
  );
};
