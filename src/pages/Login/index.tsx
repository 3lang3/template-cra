import { useModel, history } from 'umi';
import { Button, Toast } from 'react-vant';
import styles from './index.less';

export default () => {
  const { signin } = useModel('user', (model) => ({
    signin: model.signin,
  }));

  const login = async () => {
    try {
      await signin();
      history.goBack();
    } catch (error) {
      Toast.info(error.message);
    }
  };
  return (
    <div>
      <h1 className={styles.title}>Login page</h1>
      <Button color="#3f45ff" square block onClick={() => login()}>
        登 录
      </Button>
    </div>
  );
};
