import useAuth from '@/components/hooks/useAuth';
import { Redirect } from 'umi';

export default ({ children }: { children: React.ReactChild }) => {
  const { isLogin } = useAuth();
  if (isLogin) {
    return children;
  }
  return <Redirect to="/login" />;
};
