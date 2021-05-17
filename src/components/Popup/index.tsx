import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CloseOne } from '@icon-park/react';
import { CSSTransition } from 'react-transition-group';
import './popup.less';
import ScrollPenetration from '../ScrollPenetration';

/**
 * Portal渲染
 */
export function Portal(props: { children: React.ReactNode }) {
  const { children } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return createPortal(children, document.body);
}

type OverlayProps = {
  overlayClassName?: string;
  overlayStyle?: React.CSSProperties;
};

/**
 * 基础overlay组件
 * @param param0
 * @returns
 */
export function OverlayNode({
  transition,
  visible,
  handleClose,
  overlayClassName,
  overlayStyle,
}: OverlayProps & { transition?: boolean | string; visible: boolean; handleClose?: () => void }) {
  const overlayRef = useRef(null);
  const ct = useMemo(
    () => (
      <div ref={overlayRef}>
        <ScrollPenetration />
        <div
          onClick={handleClose}
          className={`local-overlay ${overlayClassName || ''}`}
          style={overlayStyle}
        />
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (transition)
    return (
      <CSSTransition
        in={visible}
        timeout={300}
        nodeRef={overlayRef}
        classNames={typeof transition === 'string' ? transition : 'local-overlay-ani'}
        unmountOnExit
      >
        {ct}
      </CSSTransition>
    );
  return visible ? ct : null;
}

type CloseableType = boolean | React.ReactNode;

export interface ModalLikeBaseProps {
  visible: boolean;
  /**
   * 是否显示遮罩层
   */
  overlay?: boolean;
  /**
   * 点击蒙层是否允许关闭
   */
  overlayClosable?: boolean;
  /**
   * 点击遮罩层或右上角叉或取消按钮的回调
   */
  onClose?: () => void;
  children: React.ReactNode;
}

interface PopupProps extends ModalLikeBaseProps, OverlayProps {
  /**
   * 弹出位置，可选值为 bottom center
   * @default center
   */
  position?: 'bottom' | 'center';
  /**
   * 是否显示圆角
   */
  round?: boolean;
  /**
   * 是否显示关闭图标
   */
  closeable?: CloseableType;
}

/**
 * 关闭按钮
 */
export function CloseNode({
  closeable,
  handleClose,
}: {
  closeable: CloseableType;
  handleClose: () => void;
}) {
  return (
    <div onClick={handleClose} className="local-popup__close-icon">
      {typeof closeable === 'boolean' ? (
        <CloseOne className="local-popup__close-icon" theme="outline" size="24" fill="#c8c9cc" />
      ) : (
        closeable
      )}
    </div>
  );
}

export default (props: PopupProps) => {
  const contentRef = useRef(null);
  const {
    position = 'center',
    closeable,
    round,
    children,
    overlay = true,
    overlayClosable = true,
    visible,
  } = props;

  const handleClose = useCallback(() => {
    if (props.onClose) props.onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Portal>
        {overlay && (
          <OverlayNode
            visible={visible}
            transition={true}
            handleClose={overlayClosable ? handleClose : undefined}
            overlayClassName={props.overlayClassName}
            overlayStyle={props.overlayStyle}
          />
        )}
        <CSSTransition
          in={visible}
          nodeRef={contentRef}
          timeout={300}
          classNames={`local-popup--${position}-ani`}
          unmountOnExit
        >
          <div
            ref={contentRef}
            className={`local-popup local-popup--${position} ${round ? 'local-popup--round' : ''}`}
          >
            {closeable && position !== 'center' ? (
              <CloseNode closeable={closeable} handleClose={handleClose} />
            ) : null}
            {children}
          </div>
        </CSSTransition>
      </Portal>
    </>
  );
};
