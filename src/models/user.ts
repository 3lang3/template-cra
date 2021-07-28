import { useState, useCallback } from 'react';
import { getCurrentUser } from '@/services/global';
import { Toast } from 'react-vant';

export default function useAuthModel() {
  const [user, setUser] = useState(null);

  const signin = useCallback(async () => {
    Toast.loading({ message: '微信登录中...', duration: 0 });
    const { data, type, msg } = await getCurrentUser();
    if (type === 1) throw new Error(msg);
    Toast.success(msg);
    setUser(data);
  }, []);

  const signout = useCallback(() => {
    // signout implementation
    setUser(null);
  }, []);

  return {
    user,
    signin,
    signout,
  };
}
