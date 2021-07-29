import { request } from '@/utils/request';

export function getBrowserGoodsDetail(params: { item_id: string }) {
  return request.get('/goods/getBrowserGoodsDetail', {
    params,
  });
}
