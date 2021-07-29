import { useState, useCallback } from 'react';
import { getCurrentUser } from '@/services/global';
import { Toast } from 'react-vant';
import { useModel } from 'umi';

export default function () {
  const { initialState, setInitialState } = useModel('@@initialState');

  /** @summary 可以根据不同宿主环境进行登录逻辑的分发 */
  const signin = useCallback(async () => {
    Toast.loading({ message: '微信登录中...', duration: 0, forbidClick: true });
    const { data, type, msg } = await getCurrentUser();
    if (type === 1) throw new Error(msg);
    Toast.success(msg);
    setInitialState(data);
  }, []);

  const signout = useCallback(() => {
    // signout implementation
    setInitialState(null);
  }, []);

  return {
    user: initialState,
    signin,
    signout,
  };
}
