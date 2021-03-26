import { stringify } from 'qs';
import { request } from '@/utils/request';

export function getList(params) {
  return request(`/home/getRecommendGoods?${stringify(params)}`);
}
