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
      <div onClick={() => Toast.loading()}>toast loading</div>
      <div
        onClick={() =>
          Toast.info('在页面中间弹出黑色半透明提示，用于消息通知、加载提示、操作结果提示等场景。')
        }
      >
        toast info
      </div>
      <div onClick={() => Toast.success()}>toast success</div>
      <div onClick={() => Toast.error('操作失败')}>toast error</div>
      <div onClick={() => Toast.destroy()}>toast clean</div>
    </div>
  );
};
