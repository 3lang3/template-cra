import Toast from '@/components/Toast';
import Popup from '@/components/Popup';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { useGlobalUser } from '@/state/global';
import history from '@/utils/history';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default () => {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const user = useGlobalUser();
  return (
    <div>
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
      <div onClick={() => Toast.error('操作失败')}>toast error</div>
      <div onClick={() => Toast.destroy()}>toast clean</div>
      <div onClick={() => setVisible(true)}>show base popup</div>
      <div onClick={() => setModal(true)}>show base modal</div>
      <div
        onClick={() =>
          Modal.alert({
            title: 'hello',
            message: 'world',
            transition: false,
            overlay: false,
            beforeClose: (ac, done) => {
              if (ac === 'confirm') setTimeout(() => done(), 2000);
            },
          })
        }
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
    </div>
  );
};
