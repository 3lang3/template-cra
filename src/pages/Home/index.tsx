/* eslint-disable no-underscore-dangle */
import { ProList } from '@/components';
import { getProductList } from '@/services/global';
import styles from './index.module.less';

export default () => {
  const rowRender = (record, i) => (
    <div
      className="h-60 bg-gray-300 mb-4 flex justify-center items-center text-lg text-white rounded-md"
      key={record.id}
    >
      {i}
    </div>
  );
  return (
    <>
      <div className="h-40 bg-blue-500 flex justify-center items-center text-white text-lg">
        Tabs placeholder
      </div>
      <ProList
        pulldown
        masonryProps={{ breakpointCols: 2, className: styles.masonry }}
        request={async ({ current, pageSize }) => {
          return getProductList({ page: current, pageSize }).then(({ data }) => ({
            data: data._list,
            total: data._page.totalCount,
            success: true,
          }));
        }}
        row={rowRender}
      />
    </>
  );
};
