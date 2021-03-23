import { Board } from '@/components';
import React from 'react';

export default ({ match }) => {
  // eslint-disable-next-line no-console
  console.log(match.params);
  return (
    <>
      <Board />
      this is user page
    </>
  );
};
