import { Link } from 'react-router-dom';

export default () => {
  // eslint-disable-next-line no-console
  console.log('render home page...');
  return (
    <div>
      this is home page <Link to="/user/ethan">user</Link>
    </div>
  );
};
