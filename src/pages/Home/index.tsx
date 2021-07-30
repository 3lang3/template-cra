import { history } from 'umi';
import { Cell, Flex } from 'react-vant';
import styles from './index.less';
import app from '@/utils/app';

export default function IndexPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page index</h1>
      <Cell title="个人主页" isLink onClick={() => history.push('/profile')} />
      <Cell
        title="登录"
        icon="contact"
        isLink
        onClick={() => history.push('/login')}
      />
    </div>
  );
}
