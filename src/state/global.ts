/**
 * constate
 * @see https://github.com/diegohaz/constate
 */

import { useSetState } from 'ahooks';
import constate from 'constate';
import { useCallback } from 'react';

type UserType = {
  nickname: string;
};

type GlobalConfigProps = {
  user: UserType;
};

const initialState: GlobalConfigProps = {
  user: {
    nickname: 'ethan',
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
