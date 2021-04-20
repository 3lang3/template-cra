/**
 * constate
 * @see https://github.com/diegohaz/constate
 */

import { useSetState } from 'ahooks';
import constate from 'constate';
import { useCallback } from 'react';

type CurrentUser = {
  nickname: string;
  is_need_bind: 0 | 1;
  member: Record<string, any>;
  shop_config: Record<string, any>;
  shop_title?: string;
};

type GlobalConfigProps = {
  user: CurrentUser;
};

const initialState: GlobalConfigProps = {
  user: {
    nickname: '3lang',
    is_need_bind: 0,
    member: {},
    shop_config: {},
  },
};

// 1️⃣ Create a custom hook as usual
function useGlobalConfig() {
  const [global, setGlobal] = useSetState(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const upgrade = useCallback((obj: GlobalConfigProps) => setGlobal(obj), []);
  return { global, upgrade };
}

// 2️⃣ Wrap your hook with the constate factory
export const [GlobalProvider, useGlobalContext, useGlobalUser, userUpgrade] = constate(
  useGlobalConfig,
  (v) => v,
  (v) => v.global.user,
  (v) => v.upgrade,
);
