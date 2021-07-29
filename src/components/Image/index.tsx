import config from '@/config';
import { Image } from 'react-vant';
import { ImageProps } from 'react-vant/es/image/PropsType';
import defaultSrc from './placeholder.jpg';

export default ({ src, ...props }: ImageProps) => {
  let finallySrc = src as any;

  if (!src) {
    finallySrc = defaultSrc;
  } else if (/^(data:image|\/\/)/.test(src)) {
    finallySrc = src;
  } else if (!/^https?:\/\//.test(src)) {
    finallySrc = `${config.cdn}/${src}`;
  }

  return <Image src={finallySrc} {...props} />;
};
