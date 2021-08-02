/**
 * 用于页面通用分享设置
 */
import config from '@/config';
import { BROWSER_ENV } from '@/config/ua';
import app, { APP_INJECT_EVENT_MAP } from '@/utils/app';
import { useEffect } from 'react';
import { useModel } from 'umi';

type ShareConfigProps = {
  /** 自定义分享标题 */
  title: string;
  /** app 模态框标题文字 */
  dialogTitle?: string;
  /** 自定义分享描述 */
  desc: string;
  /** 自定义分享链接 */
  link?: string;
  /** 自定义分享图片 */
  imgUrl?: string;
  /** 分享链接是否带上用户标识符 */
  withIdentifier?: boolean;
};

export default ({ withIdentifier = true, ...props }: ShareConfigProps) => {
  const { user } = useModel('user', (model) => ({ user: model.user }));

  // 链接带上标识符
  const defaultLink = window.location.href.replace(
    /mids=\d*/gi,
    withIdentifier ? `mids=${user.member.ids}` : '',
  );

  // 默认分享图片
  const defaultImgUrl = `${config.cdn}/${user.shop_config.share_wechat_logo}`;

  const { link = defaultLink, dialogTitle, imgUrl = defaultImgUrl } = props;

  useEffect(() => {
    const shareOption = { ...props, link, imgUrl };
    // 微信分享
    if (BROWSER_ENV.WECHAT) {
      window.wx.ready(() => {
        window.wx.updateAppMessageShareData(shareOption);
        window.wx.updateTimelineShareData(shareOption);
      });
    }
    // webview中将分享参数通过全局注入方式传给app
    if (BROWSER_ENV.WEBVIEW) {
      app.inject(APP_INJECT_EVENT_MAP.SET_SHARE_PARAMS, () => ({
        dialogTitle,
        ...shareOption,
        // app不要拼接cdn的图片地址
        imgUrl: user.shop_config.share_wechat_logo,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
