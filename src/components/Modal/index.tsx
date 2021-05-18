import * as React from 'react';
import type { ModalLikeBaseProps } from '../Popup';
import { Portal, OverlayNode } from '../Popup';
import Button from '../Button';
import { CSSTransition } from 'react-transition-group';
import './modal.less';

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
  onConfirm?: () => Promise<void>;
}

export default (props: ModalProps) => {
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
          <div className={`local-modal__content ${title ? '' : 'local-modal__content-notitle'}`}>
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
                className={`local-modal__confirm ${
                  showCancelButton && showConfirmButton ? 'hairline--left' : ''
                }`}
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
