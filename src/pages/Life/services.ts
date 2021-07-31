import { request } from '@/utils/request';

export function getLifeServiceDetail(params) {
  return request.get('/life/getshareinfo', {
    params,
  });
}
