import type { LifeServiceDetailReturn } from './services';
import { getshareinfo, getCpsUrl, getBind } from './services';
import { useRequest } from 'ahooks';
import { FullPageError, FullPageLoader } from '@/components/Chore';
import Image from '@/components/Image';
import { Flex, Toast } from 'react-vant';
import blockIconSrc from './block.png';
import { transferString } from '@/utils/utils';
import app, { APP_INJECT_EVENT_MAP } from '@/utils/app';
import styles from './index.less';
import { useEffect } from 'react';
import { APP_PAGE_ENUM } from '@/utils/app/pages';

/** 确保提供给app本地生活分享参数的类型 */
type LocalLifeShareParams = {
  background_image: string;
  button_image: string;
  bottom_color: string;
  active_text: string;
  bill_image: string;
  text_color: string;
  text_background_color: string;
};

export default ({ id }) => {
  const bindReq = useRequest(getBind, {
    manual: true,
  });
  const {
    loading,
    error,
    refresh,
    data: { data: detail } = { data: {} as LifeServiceDetailReturn },
  } = useRequest(getshareinfo, {
    defaultParams: [{ cps_id: id || '101' }],
    onSuccess: ({ data }) => {
      document.title = data.title;
      app.event.modifyTitle(data.title);
      app.inject<unknown, LocalLifeShareParams>(
        APP_INJECT_EVENT_MAP.SET_LOCAL_LIFE_PARAMS,
        () => {
          bindReq.run();
          return data;
        },
      );
    },
  });
  const { data: { data: urls } = { data: {} }, ...urlReq } = useRequest(
    getCpsUrl,
    {
      manual: true,
    },
  );

  useEffect(() => {
    app.event.enterPage('locallife');
  }, []);

  const jumpLink = () => {
    if (detail.is_tb_platform) {
      app.event.gotoLinkPage({
        link_type: APP_PAGE_ENUM.OPEN_LINK,
        outlink: { link: urls.click_url },
      });
    } else {
      window.location.href = urls.click_url;
    }
  };

  const getCoupons = async () => {
    if (urls.click_url) {
      jumpLink();
      return;
    }
    bindReq.run();
    try {
      Toast.loading({ message: '请稍后...', forbidClick: true, duration: 0 });
      const { type, msg } = await urlReq.run({ cps_id: id });
      Toast.clear();
      if (type === 1) throw new Error(msg);
      jumpLink();
    } catch (err) {
      Toast.info(err.message);
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
        <Image
          className={styles.button__img}
          src={detail.button_image}
          onClick={getCoupons}
        />
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
