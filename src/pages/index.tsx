import { useRequest } from 'umi';
import { getCurrentUser } from '@/services/global';
import { Button, Dialog } from 'react-vant';
import styles from './index.less';

export default function IndexPage() {
  useRequest(getCurrentUser, {
    onSuccess: (res) => console.log(res),
  });
  return (
    <div>
      <Button
        onClick={() =>
          Dialog.alert({
            title: '标题',
            message: '代码是写出来给人看的，附带能在机器上运行',
          })
        }
        type="primary"
      >
        测试按钮
      </Button>
      <h1 className={styles.title}>Page index</h1>
    </div>
  );
}
