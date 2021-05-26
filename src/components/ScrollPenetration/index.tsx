import { useEffect } from 'react';

/**
 * 阻止滚动穿透
 * 使用样式解决 @see https://github.com/NervJS/taro/issues/5984#issuecomment-614502302
 */
export default () => {
  useEffect(() => {
    document.body.classList.add('hack-touchmove');
    return () => {
      document.body.classList.remove('hack-touchmove');
    };
  }, []);
  return null;
};
