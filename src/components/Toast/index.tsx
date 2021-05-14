import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

function createNotification() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  let notification;
  render(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <Toast
      ref={(ref) => {
        notification = ref;
      }}
    />,
    container,
  ) as any;
  return {
    addToast(toast) {
      return notification?.addToast(toast);
    },
    destroy() {
      unmountComponentAtNode(container);
      document.body.removeChild(container);
    },
  };
}

const Toast = React.forwardRef<any, any>((_, ref) => {
  const [toasts, setToasts] = React.useState<any[]>([]);
  React.useImperativeHandle(ref, () => ({
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addToast,
  }));
  const getKey = () => `local-toast-${new Date().getTime()}`;
  const removeToast = (key) => {
    setToasts((v) =>
      v.filter((el: any) => {
        if (el.key === key && el.onClose) el.onClose();
        return el.key !== key;
      }),
    );
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addToast = (toast) => {
    const payload = { key: getKey(), ...toast };
    setToasts([payload]);
    if (payload.duration > 0) {
      setTimeout(() => {
        removeToast(payload.key);
      }, payload.duration);
    }
  };

  return (
    <div>
      {toasts.map((el) => (
        <div key={el.key}>{el.content}</div>
      ))}
    </div>
  );
});

let notification;
const toast = (type, content, duration = 2000, onClose) => {
  if (!notification) notification = createNotification();
  return notification.addToast({ type, content, duration, onClose });
};

export default {
  info(content, duration?, onClose?) {
    return toast('info', content, duration, onClose);
  },
  success(content = '操作成功', duration?, onClose?) {
    return toast('success', content, duration, onClose);
  },
  error(content, duration?, onClose?) {
    return toast('error', content, duration, onClose);
  },
  loading(content, duration?, onClose?) {
    return toast('loading', content, duration, onClose);
  },
};
