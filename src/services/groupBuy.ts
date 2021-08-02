import { request } from '@/utils/request';

// 类目列表
export function categories() {
  return request('/third/meituan/categories?plat=2');
}

// 商圈列表
export function regions() {
  return request('/third/meituan/regions');
}

// 店铺列表/全部餐饮
export function shops() {
  return request(
    '/third/meituan/shops?cid0=226&cid=&cid1=2165&plat=2&page=1&page_size=100',
  );
}
