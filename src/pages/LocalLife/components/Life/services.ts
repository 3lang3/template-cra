import { request } from '@/utils/request';

export function getLifeServiceDetail(params) {
  return request.get('/life/getshareinfo', {
    params,
  });
}

export function getCpsUrl(params) {
  return request.get('/lifeService/getPopularizeUrl', {
    params,
  });
}

export function getBind() {
  return request.post('/distributor/shareBinding');
}
