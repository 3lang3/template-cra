/* eslint-disable no-underscore-dangle */
import { ProListView, List, Image } from '@/components';
import { getProductList } from '@/services/global';
import styles from './index.module.less';

export default () => {
  const rowRender = (record, i) => (
    <div
      className="h-60 bg-white mb-4 text-center text-lg text-gray-600 rounded-md overflow-hidden"
      key={record.id}
    >
      <Image
        style={{ height: 200 }}
        className="w-full block"
        src={`https://imgs.yigeyougou.com/${record.img}`}
      />
      {i}
    </div>
  );
  return (
    <>
      <div className="h-40 bg-blue-500 flex justify-center items-center text-white text-lg">
        Tabs placeholder
      </div>
      <List title="Demo标题">
        <List.Item
          title="单元格"
          description="描述信息描述信息描述信息描述信息描述信息描述信息描述信息描述信息"
        >
          内容
        </List.Item>
        <List.Item title="单元格" arrowDirection>
          内容
        </List.Item>
      </List>
      <ProListView
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
