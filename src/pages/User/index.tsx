import { Board } from '@/components';
import { userUpgrade } from '@/state/global';

export default ({ match }) => {
  // eslint-disable-next-line no-console
  console.log(match.params);
  const upgrade = userUpgrade();
  return (
    <>
      <Board />
      this is user page
      <button onClick={() => upgrade({ user: { nickname: '3lang' } })}>upgrade</button>
    </>
  );
};
