import { request } from '@/utils/request';

// 获取用户信息
export function getCurrentUser() {
  return request(`/getMDPBaseInfo`);
}
