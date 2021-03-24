import Masonry from '@/components/Masonry';
import { useGlobalContext } from '@/state/global';
import { Link } from 'react-router-dom';

export default () => {
  // eslint-disable-next-line no-console
  console.log('render home page...');
  const { global } = useGlobalContext();
  return (
    <div>
      this is home page <Link to="/user/ethan">{global.user.nickname}</Link>
      <Masonry
        breakpointCols={2}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        <div style={{ height: 200 }} />
        <div style={{ height: 100 }} />
        <div style={{ height: 50 }} />
        <div style={{ height: 350 }} />
        <div style={{ height: 120 }} />
        <div style={{ height: 200 }} />
        <div style={{ height: 400 }} />
      </Masonry>
    </div>
  );
};
