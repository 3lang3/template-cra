import { request } from '@/utils/request';

/**
 * 生活服务分享信息接口
 * @see https://doc.sijishows.com/web/#/13?page_id=8725
 */
export type LifeServiceDetailReturn = {
  background_image: string;
  button_image: string;
  bottom_color: string;
  active_text: string;
  bill_image: string;
  text_color: string;
  text_background_color: string;
  title: string;
};
export function getshareinfo(
  params,
): Promise<{ data: LifeServiceDetailReturn }> {
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
