import * as React from 'react';
import { unmountComponentAtNode, render } from 'react-dom';
import type { ModalLikeBaseProps } from '../Popup';
import { Portal, OverlayNode } from '../Popup';
import Button from '../Button';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
import './modal.less';

type ModalFuncProps = Omit<ModalProps, 'visible' | 'children' | 'onConfirm' | 'onClose'> & {
  /**
   * 弹窗类型
   * - alert 展示消息提示弹窗
   * - confirm 展示消息确认弹窗
   */
  type: 'confirm' | 'alert';
  /**
   * 和children一样 内容字段
   */
  message: string | React.ReactNode;
};

type AsyncModalFuncProps = {
  /**
   * 点击确认按钮开启loading
   */
  showConfirmLoading?: boolean;
};

type ModalFuncInstanceProps = Omit<ModalFuncProps, 'type'>;

type ModalFuncNodeProps = {
  onDestroy: () => void;
  resolveFunc: any;
  rejectFunc: any;
} & ModalFuncProps;

type ModalType = {
  (p: ModalProps): any;

  /**
   * alert弹窗类型 展示消息提示弹窗
   */
  alert: (
    props: ModalFuncInstanceProps & AsyncModalFuncProps,
  ) => Promise<{ action: string; done: () => void }>;

  /**
   * confirm弹窗类型 展示消息确认弹窗
   */
  confirm: (
    props: ModalFuncInstanceProps & AsyncModalFuncProps,
  ) => Promise<{ action: string; done: () => void }>;

  /**
   * modal 销毁
   */
  destroy: () => void;
};

interface ModalProps extends ModalLikeBaseProps {
  /**
   * 标题
   */
  title?: string | React.ReactNode;
  /**
   * 是否展示确认按钮
   * @default true
   */
  showConfirmButton?: boolean;
  /**
   * 是否展示取消按钮
   * @default false
   */
  showCancelButton?: boolean;
  /**
   * 确认按钮文案
   * @default '确认'
   */
  confirmButtonText?: string | React.ReactNode;
  /**
   * 取消按钮文案
   * @default '取消'
   */
  cancelButtonText?: string | React.ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 确认按钮事件
   */
  onConfirm?: () => Promise<void>;
}

const Modal = (props: ModalProps) => {
  const contentRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);

  const handleClose = React.useCallback(() => {
    if (props.onClose) props.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = React.useCallback(async () => {
    if (props.onConfirm) {
      try {
        setLoading(true);
        await props.onConfirm();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.error('modal onConfirm error: ', error);
      }
      return;
    }
    handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    title,
    className,
    transition = true,
    children,
    overlay = true,
    overlayClosable = true,
    visible,
    showConfirmButton = true,
    confirmButtonText = '确认',
    showCancelButton = false,
    cancelButtonText = '取消',
  } = props;

  const disableTransition = typeof transition === 'boolean' && !transition;
  const defaultTransitionCls = disableTransition ? undefined : 'local-modal__ani';

  return (
    <Portal>
      {overlay && (
        <OverlayNode
          visible={visible}
          transition={transition}
          handleClose={overlayClosable ? handleClose : undefined}
          overlayClassName={props.overlayClassName}
          overlayStyle={props.overlayStyle}
        />
      )}
      <CSSTransition
        unmountOnExit
        in={visible}
        nodeRef={contentRef}
        timeout={disableTransition ? 0 : 300}
        classNames={typeof transition === 'string' ? transition : defaultTransitionCls}
      >
        <div
          ref={contentRef}
          className={`local-modal ${!overlay ? 'shadow-2xl' : ''} ${className || ''}`}
        >
          {title ? <div className="local-modal__header">{title}</div> : null}
          <div className={cn('local-modal__content', { 'local-modal__content-notitle': title })}>
            {children}
          </div>
          <div className="local-modal__footer hairline--top">
            {showCancelButton && (
              <Button onClick={handleClose} className="local-modal__cancel">
                {cancelButtonText}
              </Button>
            )}
            {showConfirmButton && (
              <Button
                loading={loading}
                onClick={handleConfirm}
                className={cn('local-modal__confirm', {
                  'hairline--left': showCancelButton && showConfirmButton,
                })}
              >
                {confirmButtonText}
              </Button>
            )}
          </div>
        </div>
      </CSSTransition>
    </Portal>
  );
};

const ModalFuncNode = (props: ModalFuncNodeProps & AsyncModalFuncProps) => {
  const contentRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setVisible(true);
  }, []);

  const handleConfirm = React.useCallback(() => {
    if (props.showConfirmLoading) {
      setLoading(true);
      props.resolveFunc({
        action: 'confirm',
        done: () => {
          setLoading(false);
          setVisible(false);
        },
      });
      return;
    }
    setVisible(false);
    props.resolveFunc({
      action: 'confirm',
      done: () => null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = React.useCallback(() => {
    setVisible(false);
    props.rejectFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    type = 'alert',
    title,
    className,
    transition = true,
    message,
    overlay = true,
    overlayClosable = true,
    confirmButtonText = '确认',
    cancelButtonText = '取消',
  } = props;

  const disableTransition = typeof transition === 'boolean' && !transition;
  const defaultTransitionCls = disableTransition ? undefined : 'local-modal__ani';

  return (
    <>
      {overlay && (
        <OverlayNode
          visible={visible}
          transition={transition}
          handleClose={overlayClosable ? handleClose : undefined}
          overlayClassName={props.overlayClassName}
          overlayStyle={props.overlayStyle}
        />
      )}
      <CSSTransition
        unmountOnExit
        in={visible}
        nodeRef={contentRef}
        timeout={disableTransition ? 0 : 300}
        classNames={typeof transition === 'string' ? transition : defaultTransitionCls}
        onExited={props.onDestroy}
      >
        <div
          ref={contentRef}
          className={`local-modal ${!overlay ? 'shadow-2xl' : ''} ${className || ''}`}
        >
          {title ? <div className="local-modal__header">{title}</div> : null}
          <div className={`local-modal__content ${title ? '' : 'local-modal__content-notitle'}`}>
            {message}
          </div>
          <div className="local-modal__footer hairline--top">
            {type === 'confirm' && (
              <Button onClick={handleClose} className="local-modal__cancel">
                {cancelButtonText}
              </Button>
            )}
            <Button
              loading={loading}
              onClick={handleConfirm}
              className={`local-modal__confirm ${type === 'confirm' ? 'hairline--left' : ''}`}
            >
              {confirmButtonText}
            </Button>
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

let destroyFns: any = [];

function createModal(props: Omit<ModalFuncProps, 'onClose'>) {
  const container = document.createElement('div');
  container.id = `local-modal-${new Date().getTime()}`;
  container.className = 'fixed-center z-99999 w-full h-full';
  document.body.appendChild(container);

  const destroy = () => {
    unmountComponentAtNode(container);
    document.body.removeChild(container);
    destroyFns = destroyFns.filter((el) => el.key !== container.id);
  };

  destroyFns.push({ key: container.id, destroy });

  return new Promise((resolve, reject) =>
    render(
      <ModalFuncNode {...props} resolveFunc={resolve} rejectFunc={reject} onDestroy={destroy} />,
      container,
    ),
  );
}

Modal.alert = (props: ModalFuncInstanceProps) => createModal({ type: 'alert', ...props });
Modal.confirm = (props: ModalFuncInstanceProps) => createModal({ type: 'confirm', ...props });
Modal.destroy = () => {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close.destroy();
    }
  }
};

export default Modal as ModalType;
