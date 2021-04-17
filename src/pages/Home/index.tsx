import { useGlobalContext } from '@/state/global';
import { Link } from 'react-router-dom';

export default () => {
  // eslint-disable-next-line no-console
  console.log('render home page...');
  const { global } = useGlobalContext();
  return (
    <div>
      this is home page <Link to="/user/ethan">{global.user.nickname}</Link>
    </div>
  );
};
