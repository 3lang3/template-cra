/* eslint-disable no-underscore-dangle */
import InfiniteMasonryScroll, { useInfiniteMasonry } from '@/components/InfiniteMasonryScroll';
import { useGlobalContext } from '@/state/global';
import { Link } from 'react-router-dom';
import { getList } from './services';

export default () => {
  // eslint-disable-next-line no-console
  console.log('render home page...');
  const { global } = useGlobalContext();
  const { items, scrollProps } = useInfiniteMasonry(getList);
  return (
    <div>
      this is home page <Link to="/user/ethan">{global.user.nickname}</Link>
      <InfiniteMasonryScroll
        masonryProps={{
          breakpointCols: 2,
          className: 'my-masonry-grid',
          columnClassName: 'my-masonry-grid_column',
        }}
        {...scrollProps}
        scrollThreshold={1}
      >
        {items.map((el, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} style={{ height: 200 + i * 10, background: 'grey' }} />
        ))}
      </InfiniteMasonryScroll>
    </div>
  );
};
