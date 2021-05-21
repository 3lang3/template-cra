import { request } from '@/utils/request';
import { stringify } from 'querystring';

export function getCurrentUser(params?) {
  return request(`/getMDPBaseInfo?${stringify(params)}`);
}

export function uploadImage(params?) {
  return request('/uploadsImage', {
    method: 'POST',
    body: params,
    requestType: 'form',
  });
}
