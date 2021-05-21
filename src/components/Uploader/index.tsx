import { Camera, CloseSmall } from '@icon-park/react';
import './uploader.less';

interface UploaderProps {
  value?: string | string[];
  onChange?: (props: any) => void;
  /**
   * 上传的地址
   */
  action?: string;
  /**
   * 上传所需额外参数或返回上传额外参数的方法
   */
  data?: any;
  /**
   * 是否开启图片多选，部分安卓机型不支持
   */
  multiple?: boolean;
  /**
   * 文件上传数量限制
   */
  maxCount?: number;
  /**
   * 接受上传的文件类型
   * 详见 @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
   * @default 'image/*'
   */
  accept?: string;
  /**
   * 是否禁用文件上传
   */
  disabled?: boolean;
}

export default (props: UploaderProps) => {
  // eslint-disable-next-line no-console
  console.log(props);
  const { accept = 'image/*' } = props;
  return (
    <div className="local-uploader">
      <div className="local-uploader__wrapper">
        <div className="local-uploader__preview">
          <div className="local-uploader__preview-delete">
            <CloseSmall theme="outline" fill="#fff" />
          </div>
          <div className="local-uploader__preview-image"></div>
        </div>
        <div className="local-uploader__upload">
          <Camera theme="filled" size="24" fill="#dcdee0" />
          <input type="file" accept={accept} />
        </div>
      </div>
    </div>
  );
};
