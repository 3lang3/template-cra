import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Check, Attention } from '@icon-park/react';
import { ReactComponent as Loader } from './loading.svg';
import './toast.css';

interface ToastType {
  (): void;
}
type NoticeType = 'info' | 'success' | 'error' | 'loading';
type ToastContent = React.ReactNode | string;
type ToastOnClose = () => void;

/**
 * toast 全局提示组件
 *
 * @todo
 *  - promisfiy 提供promise接口
 *  - 对象形式传递参数 eg: toast.info(config)
 */
interface ToastInstance {
  info: (content: ToastContent, duration?: number, onClose?: ToastOnClose) => ToastType;
  success: (content?: ToastContent, duration?: number, onClose?: ToastOnClose) => ToastType;
  error: (content: ToastContent, duration?: number, onClose?: ToastOnClose) => ToastType;
  loading: (content?: ToastContent, duration?: number, onClose?: ToastOnClose) => ToastType;
  destroy: () => ToastType;
}

type ToastItemType = {
  type: NoticeType;
  content: ToastContent;
  duration: number;
  onClose?: ToastOnClose;
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
  const cls = `${type !== 'info' ? 'p-8' : 'py-2.5 px-5'} local-toast-item`;
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
    setToasts([payload]); // 永远只显示第一个toast，内容替换
    if (payload.duration > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        removeToast(payload.key);
      }, payload.duration);
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
  duration = 2000,
  onClose?: ToastOnClose,
) => {
  if (!notificationInstance) notificationInstance = createNotification();
  return notificationInstance.addToast({ type, content, duration, onClose });
};

export default {
  info(content, duration, onClose) {
    return toast('info', content, duration, onClose);
  },
  success(content = '操作成功', duration, onClose) {
    return toast('success', content, duration, onClose);
  },
  error(content, duration, onClose) {
    return toast('error', content, duration, onClose);
  },
  loading(content = '加载中...', duration, onClose) {
    return toast('loading', content, duration, onClose);
  },
  destroy() {
    if (notificationInstance) notificationInstance.destroy();
    notificationInstance = undefined;
  },
} as ToastInstance;
