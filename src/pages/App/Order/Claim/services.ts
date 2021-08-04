import { request } from '@/utils/request';

export function getClaimOrder(params) {
  return request.get('/member/getClaimOrder', {
    params,
  });
}

// 认领订单
export function memberClaimOrder(data) {
  return request(`/memberClaimOrder`, {
    method: 'POST',
    data,
  });
}
