import Toast from '@/components/Toast';
import { useGlobalUser } from '@/state/global';
import history from '@/utils/history';
import { Link } from 'react-router-dom';

export default () => {
  const user = useGlobalUser();
  return (
    <div>
      this is home page 5555 123123 <Link to="/user/ethan">{user.nickname}</Link> <br />
      <div onClick={() => history.push('/login')}>go login</div>
      <div onClick={() => Toast.info('Welcome')}>toast</div>
    </div>
  );
};
