import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { CloseOne } from '@icon-park/react';
import { CSSTransition } from 'react-transition-group';
import cn from 'classnames';
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
  /**
   * 自定义遮罩层类名
   */
  overlayClassName?: string;
  /**
   * 自定义遮罩层样式
   */
  overlayStyle?: React.CSSProperties;
};

/**
 * 基础overlay组件
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
      <div
        ref={overlayRef}
        onClick={handleClose}
        className={cn('local-overlay', overlayClassName)}
        style={overlayStyle}
      >
        <ScrollPenetration />
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
        classNames="local-overlay-ani"
        unmountOnExit
      >
        {ct}
      </CSSTransition>
    );
  return visible ? ct : null;
}

type CloseableType = boolean | React.ReactNode;

export interface ModalLikeBaseProps extends OverlayProps {
  visible: boolean;
  /**
   * 动画类名 为false时关闭动画
   * @default true
   */
  transition?: boolean | string;
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

interface PopupProps extends ModalLikeBaseProps {
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
    transition = true,
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

  const disableTransition = typeof transition === 'boolean' && !transition;
  const defaultTransitionCls = disableTransition ? undefined : `local-popup--${position}-ani`;
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
          className={cn('local-popup', `local-popup--${position}`, {
            'local-popup--round': round,
          })}
        >
          {closeable && position !== 'center' ? (
            <CloseNode closeable={closeable} handleClose={handleClose} />
          ) : null}
          {children}
        </div>
      </CSSTransition>
    </Portal>
  );
};
