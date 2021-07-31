import { useEffect } from 'react';
import { getLifeServiceDetail, getCpsUrl } from './services';
import { useRequest } from 'ahooks';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import Image from '@/components/Image';
import { Flex } from 'react-vant';
import blockIconSrc from './block.png';
import { transferString } from '@/utils/utils';
import app from '@/utils/app';
import { Link } from 'umi';
import styles from './index.less';

export default ({ id }) => {
  const {
    loading,
    error,
    refresh,
    data: { data: detail } = { data: {} },
  } = useRequest(getLifeServiceDetail, {
    defaultParams: [{ cps_id: id || '101' }],
  });
  const { data: { data: urls } = { data: {} } } = useRequest(getCpsUrl, {
    defaultParams: [{ cps_id: id || '101' }],
  });

  useEffect(() => {
    document.title = detail.title;
    app.event.modifyTitle(detail.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <FullPageLoader />;
  if (error) return <FullPageError refresh={refresh} />;

  return (
    <Flex
      direction="column"
      align="center"
      style={{ backgroundColor: detail.bottom_color }}
      className={styles.life}
    >
      <Image className={styles.life__bg} src={detail.background_image} />
      <div className={styles.life__button}>
        <Image className={styles.button__img} src={detail.button_image} />
        <Link to={urls ? urls.click_url : '#'} className={styles.button}></Link>
      </div>
      <div className={styles.life__rules}>
        <Flex justify="center" align="center" className={styles.top}>
          <img src={blockIconSrc} className={styles.icon} />
          <span className={styles.title}>活动说明</span>
          <img src={blockIconSrc} className={styles.icon} />
        </Flex>
        <div
          dangerouslySetInnerHTML={{
            __html: transferString(detail.active_text),
          }}
        />
      </div>
    </Flex>
  );
};
