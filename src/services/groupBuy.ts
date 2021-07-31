import { request } from '@/utils/request';

// 类目列表
export function categories() {
  return request('/third/meituan/categories?plat=2');
}

// 商圈列表
export function regions() {
  return request('/third/meituan/regions');
}
