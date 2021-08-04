import { useEffect, useState } from 'react';
import { Button, Flex, Popup, Typography } from 'react-vant';
import cls from 'classnames';
import styles from './index.less';
import app from '@/utils/app';
import { APP_PAGE_ENUM } from '@/utils/app/pages';
import { render } from 'react-dom';

const InviteCodeMissDialog = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const close = () => setShow(false);

  const go = () => {
    app.event.gotoLinkPage({ link_type: APP_PAGE_ENUM.INVITE_CODE });
  };

  return (
    <Popup className={styles.body} visible={show} onClose={close}>
      <div className={styles.content}>
        <Typography.Text
          size="lg"
          className={styles.content__desc}
          center
          strong
        >
          您还未填写优惠码,暂无法享受福利哦~
        </Typography.Text>
      </div>
      <Flex className={styles.footer} align="center" justify="between">
        <Button
          plain
          round
          className={cls(styles.footer__btn, styles.footer__btn_outline)}
          onClick={close}
        >
          放弃福利
        </Button>
        <Button
          type="primary"
          round
          className={cls(styles.footer__btn, styles.footer__btn_primary)}
          onClick={go}
        >
          去填写邀请码
        </Button>
      </Flex>
    </Popup>
  );
};

export const inviteCodeMissDialog = () => {
  const rootContainer = document.createElement('div');
  document.body.appendChild(rootContainer);
  return render(<InviteCodeMissDialog />, rootContainer);
};
