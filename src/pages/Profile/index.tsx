import { useModel } from 'umi';
import { Button, Dialog } from 'react-vant';
import styles from './index.less';

export default () => {
  const { user, signout } = useModel('user', (model) => ({
    user: model.user,
    signout: model.signout,
  }));
  return (
    <div>
      <h1 className={styles.title}>Profile Page</h1>
      {JSON.stringify(user)}
      <Button
        square
        block
        onClick={() =>
          Dialog.alert({
            title: '标题',
            message: '确定退出登录',
            beforeClose: () =>
              new Promise((resolve) => {
                signout();
                resolve(true);
              }),
          })
        }
        type="primary"
      >
        退出登录
      </Button>
    </div>
  );
};
