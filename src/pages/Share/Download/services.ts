import { request } from '@/utils/request';

// 获取app下载地址
export function getAppDownloadUrl(params) {
  return request('/app/getVersionStatus', {
    params,
    headers: {
      'device-type': 1,
    } as any,
  });
}
