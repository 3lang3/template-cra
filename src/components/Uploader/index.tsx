/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import { useRef, useState, useEffect } from 'react';
import { Camera, CloseSmall, Rotation, CloseOne } from '@icon-park/react';
import { uploadImage, postMediaWechat } from '@/services/global';
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

type FileListItemProps = {
  /** 唯一标识符 */
  key: number;
  /** 递交给外部form的值 */
  url?: string;
  /** 图片本地url */
  localUrl?: string;
  /** 上传状态 */
  status: 'done' | 'uploading' | 'failed';
};

let key = 0;

export default (props: UploaderProps) => {
  const innerRef = useRef(false);
  const { accept = 'image/*', name = 'img[]', data, value, multiple = true, maxCount = 1 } = props;
  const uploadReq = useRequest(uploadImage, { manual: true });
  const isSingle = !multiple || maxCount === 1;
  const [list, setList] = useState<FileListItemProps[]>(() => {
    if (typeof value === 'string') {
      return [{ status: 'done', url: value, key: key++ }];
    }
    if (Array.isArray(value)) {
      return value.map((url) => ({ status: 'done', url, key: key++ }));
    }
    return [];
  });
  const acceptCount = isSingle ? 1 : maxCount;
  const showUploader = list.length < acceptCount;

  useEffect(() => {
    if (innerRef.current) {
      innerRef.current = false;
      return;
    }
    if (!value) {
      setList([]);
      return;
    }
    if (typeof value === 'string') {
      setList([{ status: 'done', url: value, key: key++ }]);
      return;
    }
    if (Array.isArray(value)) {
      setList(value.map((url) => ({ status: 'done', url, key: key++ })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  // 同步表单值
  const triggerChange = (v: FileListItemProps[]) => {
    if (props.onChange) {
      props.onChange(isSingle ? v[0].url : v.map((el) => el.url));
    }
    setList(v);
    innerRef.current = true;
  };
  // 本地上传
  const onFileInputChange = async ({ target }) => {
    const { files } = target;
    const localFiles = Array.prototype.slice.call(files);

    if (list.length + localFiles.length > acceptCount) return;
    const startIdx = list.length;
    const localFilesList = localFiles.map((file) => ({
      localUrl: URL.createObjectURL(file),
      status: 'uploading',
      key: key++,
    })) as FileListItemProps[];
    setList((v) => [...v, ...localFilesList]);

    const formdata = new FormData();
    if (isSingle || files.length === 1) {
      formdata.append(name, files[0]);
    }
    if (files.length > 1) {
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < files.length; i++) {
        formdata.append(name, files[i]);
      }
    }
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([k, v]) => formdata.append(k, v));
    }

    try {
      const { data: res, type, msg } = await uploadReq.run(formdata);
      if (type === 1) throw Error(msg);
      setList((v) => {
        const newList = v.map((el, i) => {
          if (i >= startIdx) return { ...el, status: 'done', url: res.url[res.url.length - i - 1] };
          return el;
        }) as FileListItemProps[];
        if (props.onChange) {
          props.onChange(isSingle ? newList[0].url : newList.map((el) => el.url));
        }
        return newList;
      });
    } catch (error) {
      // 上传失败status调整
      setList((v) =>
        v.map((el, i) => {
          if (i >= startIdx) {
            return { ...el, status: 'failed' };
          }
          return el;
        }),
      );
      console.log(error);
    }
  };
  // 微信上传
  const onWxUpload = async () => {
    try {
      const values = await wxUploadImage();
      triggerChange(values.map((url) => ({ status: 'done', url, key: key++ })));
    } catch (error) {
      console.log(error);
    }
  };

  // 删除事件
  const deleteItem = (k) => {
    const newValue = list.filter((el) => el.key !== k) as FileListItemProps[];
    triggerChange(newValue);
  };

  const isWechat = false;
  return (
    <div className="local-uploader">
      <div className="local-uploader__wrapper">
        {list.length
          ? list.map(({ key: _id, url, status, localUrl }) => (
              <div key={_id} onClick={() => deleteItem(_id)} className="local-uploader__preview">
                {status !== 'uploading' && (
                  <div className="local-uploader__preview-delete">
                    <CloseSmall theme="outline" fill="#fff" />
                  </div>
                )}
                {status === 'uploading' || status === 'failed' ? (
                  <div className="local-uploader__mask">
                    {status === 'uploading' ? (
                      <Rotation
                        theme="outline"
                        className="local-uploader__mask-icon local-loader"
                      />
                    ) : (
                      <CloseOne theme="outline" className="local-uploader__mask-icon" />
                    )}

                    <div className="local-uploader__mask-msg">
                      {(() => {
                        if (status === 'uploading') return '上传中...';
                        if (status === 'failed') return '上传失败';
                        return null;
                      })()}
                    </div>
                  </div>
                ) : null}
                <div className="local-uploader__preview-image">
                  <img alt="img" src={localUrl || `https://img.yigeyougou.com/${url}`} />
                </div>
              </div>
            ))
          : null}
        {showUploader && (
          <div className="local-uploader__upload">
            <Camera theme="filled" size="24" fill="#dcdee0" />
            {isWechat ? (
              <div className="local-uploader__upload-input" onClick={onWxUpload} />
            ) : (
              <input
                className="local-uploader__upload-input"
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={onFileInputChange}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

type PromisifyWxChooseImageProps = {
  /**
   * 最大选择数量
   * @default 9
   */
  count?: number;
  sizeType?: string[];
  sourceType?: string[];
  chooseSuccess?: (localIds) => void;
};

function promisifyWxChooseImage({
  count,
  sizeType = ['original', 'compressed'],
  sourceType = ['album', 'camera'],
  chooseSuccess,
}: PromisifyWxChooseImageProps): Promise<{ localIds: any[] }> {
  return new Promise((resolve, reject) => {
    try {
      window.wx.chooseImage({
        count, // 默认9
        sizeType, // 可以指定是原图还是压缩图，默认二者都有
        sourceType, // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          if (chooseSuccess) chooseSuccess(res.localIds);
          resolve(res);
        },
        error: (err) => {
          console.log('wx.chooseImage error callback:', err);
          reject(err);
        },
      });
    } catch (error) {
      console.log('wx.chooseImage error:', error);
      reject(error);
    }
  });
}

type PromisifyWxUploadImageProps = {
  /**
   * 需要上传的图片的本地ID，由chooseImage接口获得
   */
  localId: number | string;
  /**
   * 是否显示进度提示
   * @default 1
   */
  isShowProgressTips?: number;
};
function promisifyWxUploadImage({
  localId,
  isShowProgressTips = 1,
}: PromisifyWxUploadImageProps): Promise<{ serverId: any; url: string }> {
  return new Promise((resolve, reject) => {
    try {
      window.wx.uploadImage({
        localId,
        isShowProgressTips,
        success: async (res) => {
          try {
            const payload = { media_id: res.serverId };
            console.log('payload:', payload);
            const { data, type, msg } = await postMediaWechat(payload);
            if (type === 1) throw new Error(msg);
            resolve({ ...data, ...res });
          } catch (error) {
            console.log('postMediaWechat error:', error);
            reject(error);
          }
        },
        error: (err) => {
          console.log('wx.uploadImage error callback:', err);
          reject(err);
        },
      });
    } catch (error) {
      console.log('wx.uploadImage error:', error);
      reject(error);
    }
  });
}

async function wxUploadImage(
  opts?: PromisifyWxChooseImageProps & Pick<PromisifyWxUploadImageProps, 'isShowProgressTips'>,
): Promise<string[]> {
  const rs: string[] = [];
  try {
    const { isShowProgressTips = 1, ...rest } = opts || {};
    const { localIds } = await promisifyWxChooseImage(rest);
    // eslint-disable-next-line no-restricted-syntax
    for (const localId of localIds) {
      // eslint-disable-next-line no-await-in-loop
      const { url } = await promisifyWxUploadImage({ localId, isShowProgressTips });
      rs.push(url);
    }
  } catch (error) {
    console.log('wxUploadImage run error:', error);
  }
  return rs;
}
