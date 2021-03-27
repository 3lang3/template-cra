/* eslint-disable no-underscore-dangle */
import { ProInfiniteScroll } from '@/components/InfiniteMasonryScroll';
import { useGlobalContext } from '@/state/global';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getList } from './services';

export default () => {
  // eslint-disable-next-line no-console
  console.log('render home page...');
  const [params, setP] = useState({ a: 123 });
  const { global } = useGlobalContext();
  return (
    <div>
      this is home page <Link to="/user/ethan">{global.user.nickname}</Link>
      <button onClick={() => setP((v) => ({ a: v.a + 1 }))}>update params</button>
      <ProInfiniteScroll<{ title: string }>
        breakpointCols={1}
        loader={<div>loading...</div>}
        request={getList}
        pagination={{
          defaultPageSize: 5,
          defaultCurrent: 3,
        }}
        endMessage={<div>end message</div>}
        params={params}
        itemRender={(item, i) => (
          <div key={i} style={{ height: 200 + i * 10, background: 'grey' }}>
            {item.title}
          </div>
        )}
      />
    </div>
  );
};
