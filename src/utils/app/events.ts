import { BROWSER_ENV } from '@/config/ua';
import app, { runAppMethod } from '.';
import { tokenHelper } from '../utils';

type OutlinkType = {
  id?: string | number;
  ids?: string | number;
  link?: string;
};

export const eventMap = {
  /**
   * 获取app webview下的token
   * @summary ios的getToken方法, ios会主动调用setToken方法注入token
   * @summary andriod的getToken方法会直接返回token
   */
  getToken: () => {
    let token = runAppMethod('getToken');
    if (BROWSER_ENV.ANDROID) {
      tokenHelper.set(token);
    }
  },
  /**
   * 跳转后台配置页面
   */
  gotoLinkPage: (options: {
    link_type: number | string;
    outlink?: OutlinkType;
  }) => runAppMethod('gotoLinkPage', options),
  /**
   * 跳转积分优惠券页面
   * @param {string|number} ids 积分商品ids
   */
  jumpPointCouponPage: (ids: string | number) =>
    runAppMethod('jumpPointCouponPage', ids),
  /**
   * 跳转积分明细
   */
  jumpPointDetailList: () => runAppMethod('jumpPointDetailList'),
  /**
   * 更改标题
   * @param {string} title 标题
   */
  modifyTitle: (title: string) => runAppMethod('modifyTitle', title),
  /**
   * 积分任务跳转
   * @param {any} task 积分任务对象
   */
  pointTaskJump: (task: any) =>
    runAppMethod('pointTaskJump', JSON.stringify(task)),
  /**
   * 复制文本
   * @param {string} text 需要复制的文本
   */
  doCopy: (text: string) => runAppMethod('doCopy', text),
  /**
   * 页面右上角分享按钮开关
   * - 0 不显示
   * - 1 显示
   */
  togglePageShare: (type: 0 | 1) => runAppMethod('SJXHelpIsHiddenShare', type),
  /**
   * 分享文案到微信
   */
  shareTextToWechat: (options: {
    text: string;
    /**
     * 分享路径
     * - 0 微信好友
     * - 1 朋友圈
     */
    shareType: 0 | 1;
  }) => runAppMethod('shareTextToWechat', options),
  /** 签到海报图片数据 */
  shareSignInPoster: (base64: string) =>
    runAppMethod('shareSignInPoster', base64),
  /** app检查是否开启推送 */
  checkPushAndShowDialog: () => runAppMethod('checkPushAndShowDialog'),
  /**
   * 通知app进入某些页面
   * @param {string} pageType 页面类型
   * - check 签到页面
   * - pointCenter 积分中心
   */
  enterPage: (pageType: 'check' | 'pointCenter') =>
    runAppMethod('enterPage', pageType),
  /**
   * 通知app调用返回前提示弹窗
   * @example 签到页用户未签到离开, 则弹出相应提示
   */
  setBackInfo: (options: {
    /** 弹窗主文案 */
    message: string;
    /** 弹窗辅助文案 */
    message2?: string;
    /** 弹窗primary按钮文字 */
    positiveButtonText?: string;
    /** 弹窗cancel按钮文字 */
    negativeButtonText?: string;
  }) => {
    app.inject(APP_INJECT_EVENT_MAP.SET_GOBACK_PARAMS, () => options);
    runAppMethod('setBackInfo');
  },
  /**
   * 获取app版本号
   * @summary 进入ios的webview后, ios会主动调用window.setAppVersion方法注入当前ios版本号
   */
  getAppVersion: (): string => {
    const ver = BROWSER_ENV.IOS
      ? window.localStorage.getItem('app_version')
      : runAppMethod('getAppVersion');
    return ver;
  },
};

/**
 * 需要挂载到全局的事件名称
 * app需要主动调用
 */
export const APP_INJECT_EVENT_MAP = {
  /** ios写入版本号 */
  APP_VERSION: 'setAppVersion',
  /** app写入token */
  SET_TOKEN: 'setToken',
  /** app获取分享参数 */
  SET_SHARE_PARAMS: 'app_invoke_getWxShareOption',
  /** app获取回退按钮提醒参数 */
  SET_GOBACK_PARAMS: 'app_invoke_getBackInfoOption',
};
