import { useEffect } from 'react';

/**
 * 阻止滚动穿透
 * 使用样式解决 @see https://github.com/NervJS/taro/issues/5984#issuecomment-614502302
 */
export default () => {
  useEffect(() => {
    const cls = document.body.classList;
    cls.add('hack-touchmove');
    document.body.className = cls.value;
    return () => {
      const rcls = document.body.classList;
      rcls.remove('hack-touchmove');
      document.body.className = rcls.value;
    };
  }, []);
  return null;
};
