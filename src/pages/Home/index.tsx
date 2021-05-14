import { useGlobalUser } from '@/state/global';
import history from '@/utils/history';
import { Link } from 'react-router-dom';

export default () => {
  // eslint-disable-next-line no-console
  console.log('render home page...');
  const user = useGlobalUser();
  return (
    <div>
      this is home page 5555 123123 <Link to="/user/ethan">{user.nickname}</Link> <br />
      <div onClick={() => history.push('/login')}>go login</div>
      <div className="md:flex bg-gray-100 p-4">
        <div className="md:flex-shrink-0">
          <img
            className="rounded-lg md:w-56"
            src="/logo512.png"
            alt="Woman paying for a purchase"
          />
        </div>
        <div className="mt-4 md:mt-0 md:ml-6">
          <div className="uppercase tracking-wide text-sm text-indigo-600 font-bold">Marketing</div>
          <a
            href="/get-started"
            className="block mt-1 text-lg leading-tight font-semibold text-gray-900 hover:underline"
          >
            Finding customers for your new business
          </a>
          <p className="mt-2 text-gray-600">
            Getting a new business off the ground is a lot of hard work. Here are five ideas you can
            use to find your first customers.
          </p>
        </div>
      </div>
    </div>
  );
};
