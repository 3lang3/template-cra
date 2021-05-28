import { Button, Modal, Popup, Toast, Uploader, Swipe, PullRefresh } from '@/components';
import { useGlobalUser } from '@/state/global';
import history from '@/utils/history';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './index.module.less';

export default () => {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const user = useGlobalUser();
  return (
    <div className={styles.home} style={{ minHeight: '200vh' }}>
      <div style={{ height: 200 }} />
      <PullRefresh
        successText="刷新成功"
        pullingText="下拉即可刷新"
        loosingText="释放即可刷新"
        loadingText="加载中..."
        refresh={(done) => {
          setTimeout(() => done(), 2000);
        }}
      >
        hahahasda
      </PullRefresh>
      this is home page 5555 123123 <Link to="/user/ethan">{user.nickname}</Link> <br />
      <div onClick={() => history.push('/login')}>go login</div>
      <div onClick={() => Toast.loading()}>toast loading</div>
      <div
        onClick={() =>
          Toast.info('在页面中间弹出黑色半透明提示，用于消息通知、加载提示、操作结果提示等场景。')
        }
      >
        toast info
      </div>
      <div onClick={() => Toast.success()}>toast success</div>
      <div onClick={() => Toast.error('操作失败', 0, null, false)}>toast error</div>
      <div onClick={() => Toast.destroy()}>toast clean</div>
      <div onClick={() => setVisible(true)}>show base popup</div>
      <div onClick={() => setModal(true)}>show base modal</div>
      <div
        onClick={async () => {
          try {
            const { done } = await Modal.confirm({
              title: 'hello',
              message: 'world',
              showConfirmLoading: true,
            });
            setTimeout(() => done(), 2000);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log('close', e);
          }
        }}
      >
        show modal confirm
      </div>
      <Button block disabled type="primary">
        默认按钮
      </Button>
      <Popup position="bottom" visible={visible} onClose={() => setVisible(false)}>
        hello
      </Popup>
      <Modal
        title="标题"
        visible={modal}
        onClose={() => setModal(false)}
        onConfirm={async () =>
          new Promise((resolve) => {
            setTimeout(() => {
              setModal(false);
              resolve();
            }, 2000);
          })
        }
      >
        代码是写出来给人看的，附带能在机器上运行代码是写出来给人看的，附带能在机器上运行代码是写出来给人看的，附带能在机器上运行代码是写出来给人看的，附带能在机器上运行
      </Modal>
      <Uploader maxCount={9} />
      <Swipe slidesPerView="auto" spaceBetween={24} className={styles.swipe}>
        {Array.from({ length: 5 }, (_, i) => (
          <Swipe.SwiperSlide key={i}>Slide{i + 1}</Swipe.SwiperSlide>
        ))}
      </Swipe>
      <Swipe className="mt-5">
        {Array.from({ length: 5 }, (_, i) => (
          <Swipe.SwiperSlide key={i}>Slide{i + 1}</Swipe.SwiperSlide>
        ))}
      </Swipe>
    </div>
  );
};
