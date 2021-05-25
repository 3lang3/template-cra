import { request } from '@/utils/request';
import { stringify } from 'querystring';

export function getCurrentUser(params?) {
  return request(`/getMDPBaseInfo?${stringify(params)}`);
}

export function uploadImage(
  params?,
): Promise<{ msg: string; type: number; data: { url: string[] } }> {
  return request('/uploadsImage', {
    method: 'POST',
    body: params,
    requestType: 'form',
  });
}

// 微信上传图片
export function postMediaWechat(params) {
  return request('/upload/getMedia', {
    method: 'POST',
    data: params,
  });
}
