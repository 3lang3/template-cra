import { PullRefresh } from '@/components';

export default () => {
  return (
    <>
      <div className="h-40 bg-blue-500 flex justify-center items-center text-white text-lg">
        Tabs placeholder
      </div>
      <PullRefresh refresh={(done) => setTimeout(() => done(), 2000)}>
        <div className="h-96 bg-gray-200"></div>
      </PullRefresh>
    </>
  );
};
