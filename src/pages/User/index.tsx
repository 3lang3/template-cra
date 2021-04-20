import { Board } from '@/components';
import { userUpgrade, useGlobalUser } from '@/state/global';

export default ({ match }) => {
  // eslint-disable-next-line no-console
  console.log(match.params);
  const upgrade = userUpgrade();
  const user = useGlobalUser();
  return (
    <>
      <Board />
      this is user page 123
      <button onClick={() => upgrade({ user: { ...user, nickname: '3lang123' } })}>upgrade</button>
    </>
  );
};
