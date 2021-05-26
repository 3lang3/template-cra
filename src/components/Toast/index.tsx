import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Check, Attention } from '@icon-park/react';
import cn from 'classnames';
import { ReactComponent as Loader } from './loading.svg';
import './toast.css';
import { Portal } from '../Popup';

interface ToastType {
  (): void;
}
type NoticeType = 'info' | 'success' | 'error' | 'loading';
type ToastContent = React.ReactNode | string;
type ToastOnClose = (() => void) | null | false;

/**
 * toast 全局提示组件
 *
 * @todo
 *  - promisfiy 提供promise接口
 *  - 对象形式传递参数 eg: toast.info(config)
 */
interface ToastInstance {
  info: (
    content: ToastContent,
    duration?: number,
    onClose?: ToastOnClose,
    mask?: boolean,
  ) => ToastType;
  success: (
    content?: ToastContent,
    duration?: number,
    onClose?: ToastOnClose,
    mask?: boolean,
  ) => ToastType;
  error: (
    content: ToastContent,
    duration?: number,
    onClose?: ToastOnClose,
    mask?: boolean,
  ) => ToastType;
  loading: (
    content?: ToastContent,
    duration?: number,
    onClose?: ToastOnClose,
    mask?: boolean,
  ) => ToastType;
  destroy: () => ToastType;
}

type ToastItemType = {
  type: NoticeType;
  content: ToastContent;
  duration: number;
  onClose?: ToastOnClose;
  mask?: boolean;
};
type ToastItemTypeWithKey = { key: React.Key } & ToastItemType;

type AddToastFn = (toast: ToastItemType) => void;

type NotificationRef = {
  addToast: AddToastFn;
};
type NotificationInstance = {
  addToast: AddToastFn;
  destroy: () => void;
};

type ToastItemProps = {
  content: ToastContent;
  type: NoticeType;
};
const ToastItem = ({ content, type }: ToastItemProps) => {
  const cls = cn('local-toast-item', {
    'p-8': type !== 'info',
    'py-2.5 px-5': type === 'info',
  });
  return (
    <div className={cls}>
      {type !== 'info' && (
        <div className="flex align-middle justify-center mb-2">
          {(() => {
            if (type === 'loading') return <Loader />;
            if (type === 'success') return <Check theme="outline" size="34" fill="#fff" />;
            if (type === 'error') return <Attention theme="outline" size="34" fill="#fff" />;
            return null;
          })()}
        </div>
      )}
      {content}
    </div>
  );
};

const Toast = React.forwardRef<NotificationRef, any>((_, ref) => {
  const [showMask, setShowMask] = React.useState(false);
  const timerRef = React.useRef<any>();
  const [toasts, setToasts] = React.useState<ToastItemTypeWithKey[]>([]);

  // 获取唯一key
  const getKey = () => `local-toast-item-${new Date().getTime()}`;

  // 移除toast
  const removeToast = (key) => {
    setToasts((v) =>
      v.filter((el) => {
        if (el.key === key && el.onClose) el.onClose();
        return el.key !== key;
      }),
    );
  };

  // 添加toast
  const addToast: AddToastFn = (toast) => {
    const payload = { key: getKey(), ...toast } as ToastItemTypeWithKey;
    setShowMask(payload.mask || false);
    setToasts([payload]); // 永远只显示第一个toast，内容替换
    if (payload.duration > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        removeToast(payload.key);
        setShowMask(false);
      }, payload.duration * 1000);
    }
  };

  React.useImperativeHandle(ref, () => ({
    addToast,
  }));

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {showMask && (
        <Portal>
          <div className="local-overlay--transparent" />
        </Portal>
      )}
      {toasts.map((el) => (
        <ToastItem key={el.key} type={el.type} content={el.content} />
      ))}
    </>
  );
});

function createNotification(): NotificationInstance {
  const container = document.createElement('div');
  container.id = `local-toast-${new Date().getTime()}`;
  container.className = 'fixed-center z-99999 local-toast';
  document.body.appendChild(container);
  let rootNotification: NotificationRef;
  render(
    <Toast
      ref={(ref) => {
        if (ref) rootNotification = ref;
      }}
    />,
    container,
  );
  return {
    addToast(toast: ToastItemType) {
      return rootNotification?.addToast(toast);
    },
    destroy() {
      unmountComponentAtNode(container);
      document.body.removeChild(container);
    },
  };
}

let notificationInstance: NotificationInstance | undefined;

const toast = (
  type: NoticeType,
  content: ToastContent,
  duration = 2,
  onClose?: ToastOnClose,
  mask = true,
) => {
  if (!notificationInstance) notificationInstance = createNotification();
  return notificationInstance.addToast({ type, content, duration, onClose, mask });
};

export default {
  info(content, duration, onClose, mask) {
    return toast('info', content, duration, onClose, mask);
  },
  success(content = '操作成功', duration, onClose, mask) {
    return toast('success', content, duration, onClose, mask);
  },
  error(content, duration, onClose, mask) {
    return toast('error', content, duration, onClose, mask);
  },
  loading(content = '加载中...', duration, onClose, mask) {
    return toast('loading', content, duration, onClose, mask);
  },
  destroy() {
    if (notificationInstance) notificationInstance.destroy();
    notificationInstance = undefined;
  },
} as ToastInstance;
