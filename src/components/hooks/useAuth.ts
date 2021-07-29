import { useModel } from 'umi';

export default function useAuth() {
  const { user } = useModel('user', (model) => ({ user: model.user }));
  return { isLogin: !!user };
}
