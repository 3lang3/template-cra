/* eslint-disable no-console */
import { Camera, CloseSmall } from '@icon-park/react';
import { uploadImage } from '@/services/global';
import { useRequest } from 'ahooks';
import './uploader.less';

interface UploaderProps {
  value?: string | string[];
  onChange?: (props: any) => void;
  /**
   * 上传的地址
   */
  action?: string;
  /**
   * 发到后台的文件参数名
   */
  name?: string;
  /**
   * 上传所需额外参数或返回上传额外参数的方法
   */
  data?: { name?: string } & Record<string, any>;
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
  const { accept = 'image/*', name = 'img[]', data, value, multiple = false, maxCount = 1 } = props;
  const uploadReq = useRequest(uploadImage, { manual: true });

  const onFileInputChange = async ({ target }) => {
    const { files } = target;
    const form = new FormData();
    if (!multiple || maxCount === 1 || files.length === 1) {
      form.append(name, files[0]);
    }
    if (files.length > 1) {
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < files.length; i++) {
        form.append(name, files[i]);
      }
    }
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => form.append(k, v));
    }
    try {
      const { data: res, type, msg } = await uploadReq.run(form);
      if (type === 1) throw Error(msg);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
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
          <input type="file" accept={accept} value={value} onChange={onFileInputChange} />
        </div>
      </div>
    </div>
  );
};
