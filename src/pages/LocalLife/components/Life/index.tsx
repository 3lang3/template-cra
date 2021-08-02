import { useEffect } from 'react';
import { getLifeServiceDetail, getCpsUrl, getBind } from './services';
import { useRequest } from 'ahooks';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import Image from '@/components/Image';
import { Flex } from 'react-vant';
import blockIconSrc from './block.png';
import { transferString } from '@/utils/utils';
import app, { APP_INJECT_EVENT_MAP } from '@/utils/app';
import styles from './index.less';

export default ({ id }) => {
  const bindReq = useRequest(getBind, {
    manual: true,
  });
  const {
    loading,
    error,
    refresh,
    data: { data: detail } = { data: {} },
  } = useRequest(getLifeServiceDetail, {
    defaultParams: [{ cps_id: id || '101' }],
    onSuccess: (res) => {
      app.inject(APP_INJECT_EVENT_MAP.SET_LOCAL_LIFE_PARAMS, async () => {
        await bindReq.run();
        return res.data;
      });
    },
  });
  const { data: { data: urls } = { data: {} } } = useRequest(getCpsUrl, {
    defaultParams: [{ cps_id: id || '101' }],
  });

  useEffect(() => {
    document.title = detail.title;
    app.event.modifyTitle(detail.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getCoupons = async () => {
    await bindReq.run();
    if (urls.click_url) {
      window.open(urls.click_url);
    }
  };

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
        <div className={styles.button} onClick={getCoupons}></div>
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
