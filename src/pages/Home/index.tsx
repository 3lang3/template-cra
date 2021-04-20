import { useGlobalUser } from '@/state/global';
import history from '@/utils/history';
import { Link } from 'react-router-dom';

export default () => {
  // eslint-disable-next-line no-console
  console.log('render home page...');
  const user = useGlobalUser();
  return (
    <div>
      this is home page <Link to="/user/ethan">{user.nickname}</Link> <br />
      <div onClick={() => history.push('/login')}>go login</div>
    </div>
  );
};
