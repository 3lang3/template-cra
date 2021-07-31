import styles from './index.less';
import { getLifeServiceDetail } from './services';
import { useRequest } from 'ahooks';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import Image from '@/components/Image';
import { Flex } from 'react-vant';
import blockIconSrc from './block.png';

const title = {
  '101': '饿了么',
  '102': '口碑红包',
  '103': '饿了么果蔬商超',
  '502': '美团外卖',
  '506': '美团果蔬商超',
  '507': '美团团购',
  '801': '肯德基',
};

export default ({ location }) => {
  const { query } = location;
  document.title = title[query.type];
  const {
    loading,
    error,
    refresh,
    data: { data: detail } = { data: {} },
  } = useRequest(getLifeServiceDetail, {
    defaultParams: [{ cps_id: query.type || '101' }],
  });

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;

  return (
    <Flex
      direction="column"
      justify="between"
      style={{ backgroundColor: detail.bottom_color }}
      className={styles.life}
    >
      <Image className={styles.life__bg} src={detail.background_image} />
      <div className={styles.life__button}>
        <Image className={styles.button__img} src={detail.button_image} />
        <div className={styles.button}></div>
      </div>
      <div className={styles.life__rules}>
        <Flex>
          <img src={blockIconSrc} className={styles.icon} />
          <span className={styles.title}>活动说明</span>
          <img src={blockIconSrc} className={styles.icon} />
        </Flex>
        <div dangerouslySetInnerHTML={{ __html: detail.active_text }} />
      </div>
    </Flex>
  );
};
