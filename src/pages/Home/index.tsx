/* eslint-disable no-underscore-dangle */
import { ProList } from '@/components';
import { getProductList } from '@/services/global';

export default () => {
  return (
    <>
      <div className="h-40 bg-blue-500 flex justify-center items-center text-white text-lg">
        Tabs placeholder
      </div>
      <ProList
        request={async ({ current, pageSize }) => {
          return getProductList({ page: current, pageSize }).then(({ data }) => ({
            data: data._list,
            total: data._page.totalCount,
            success: true,
          }));
        }}
        row={(record, i) => (
          <div
            className="h-40 bg-gray-400 mb-4 flex justify-center items-center text-lg text-white"
            key={record.id}
          >
            {i}
          </div>
        )}
      />
    </>
  );
};
