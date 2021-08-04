import { Flex, Toast, Typography } from 'react-vant';
import logo from '@/assets/logo.png';
import styles from './index.less';
import { useEffect, useRef } from 'react';
import { getAppDownloadUrl } from './services';
import { BROWSER_ENV } from '@/config/ua';
import { ReactComponent as AndroidIcon } from './static/andriod.svg';
import { ReactComponent as IosIcon } from './static/ios.svg';

export default () => {
  const downloadRef = useRef<any>();
  useEffect(() => {
    const getUrl = async () => {
      try {
        const { data, type, msg } = await getAppDownloadUrl();
        if (type === 1) throw new Error(msg);
        downloadRef.current = data.url;
      } catch (error) {
        Toast.info(error.message);
      }
    };
    getUrl();
  }, []);

  const onDownload = async () => {
    window.location.href = downloadRef.current;
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <Flex align="center" justify="center">
          <img className={styles.logo} alt="logo" src={logo} />
          <Typography.Text size="lg" strong>
            少花钱 多省钱
          </Typography.Text>
        </Flex>
        <Flex
          onClick={onDownload}
          className={styles.btn}
          align="center"
          justify="center"
        >
          {BROWSER_ENV.IOS ? <IosIcon /> : <AndroidIcon />}
          立即下载
        </Flex>
        <Typography.Text size="sm">
          注册APP输入优惠码,领券再购物~
        </Typography.Text>
      </div>
    </div>
  );
};
