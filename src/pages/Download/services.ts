import { BROWSER_ENV } from '@/config/ua';
import { request } from '@/utils/request';

// 获取app下载地址
export function getAppDownloadUrl() {
  return request('/app/getVersionStatus', {
    params: { app_version: '1.0' },
    headers: {
      'device-type': BROWSER_ENV.IOS ? 1 : 2,
    } as any,
  });
}
