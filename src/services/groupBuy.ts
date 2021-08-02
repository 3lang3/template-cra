import { request } from '@/utils/request';

// 类目列表/全部餐饮
export function categories(params: any = { plat: 2 }) {
  return request(`/third/meituan/categories`, {
    method: 'GET',
    params,
  });
}

// 商圈列表
export function regions() {
  return request('/third/meituan/regions');
}

// 团单列表
export function deals() {
  return request(
    '/third/meituan/deals?cid0=226&cid=&cid1=2165&plat=2&page=1&page_size=10',
  );
}
