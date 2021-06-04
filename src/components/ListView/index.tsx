/**
 * @see https://github.com/ankeetmaini/react-infinite-scroll-component#props
 */
import { useRequest, useSetState } from 'ahooks';
import * as React from 'react';
import type { Props as InfiniteScrollProps } from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { MasonryCssProps } from '@/components/Masonry';
import Masorny from '@/components/Masonry';
import type { PullRefreshProps } from '@/components/PullRefresh';
import PullRefresh from '@/components/PullRefresh';

const DefaultLoader = React.memo(
  () => <div className="text-center py-4 text-gray-400 text-sm">加载中...</div>,
  () => true,
);

const DefaultEndMessage = React.memo(
  () => (
    <div className="text-center py-4 text-gray-400 text-sm">
      <b>我是有底线的</b>
    </div>
  ),
  () => true,
);

type ListViewProps = {
  masonryProps?: Omit<MasonryCssProps, 'children'>;
  children: React.ReactNode[];
  onLoad: () => void;
} & Partial<Omit<InfiniteScrollProps, 'next' | 'dataLength' | 'hasMore'>>;

export const ListView = ({
  children,
  onLoad,
  loader = <DefaultLoader />,
  endMessage = <DefaultEndMessage />,
  masonryProps,
  ...props
}: ListViewProps) => {
  return (
    <InfiniteScroll
      hasMore={true}
      dataLength={React.Children.count(children)}
      loader={loader}
      endMessage={endMessage}
      scrollThreshold={1}
      next={onLoad}
      {...props}
    >
      {masonryProps ? <Masorny {...masonryProps}>{children}</Masorny> : children}
    </InfiniteScroll>
  );
};

type ProListViewProps<T> = {
  row: (item: T, index: number, itemArr: T[]) => React.ReactNode;
  request: (params: { pageSize: number; current: number }) => void;
  params?: Record<string, any>;
  pulldown?: boolean | PullRefreshProps;
} & Omit<ListViewProps, 'onLoad' | 'children'>;

export function ProListView<T = Record<string, any>>({
  request,
  row,
  loader = <DefaultLoader />,
  endMessage = <DefaultEndMessage />,
  params = {},
  masonryProps,
  pulldown,
}: ProListViewProps<T>) {
  const { loading, run } = useRequest<{ total: number; success: boolean; data: any[] }>(request, {
    manual: true,
  });
  const [state, set] = useSetState<{ items: any[]; hasMore: boolean }>({
    items: [],
    hasMore: true,
  });
  const initRef = React.useRef(false);
  const paginationRef = React.useRef({ current: 1, pageSize: 10, total: 0 });

  const onLoad = async (reset?) => {
    if (loading || !state.hasMore) return;
    try {
      const pagi = paginationRef.current;
      const payload = { ...params, ...pagi, current: reset ? 1 : pagi.current };
      const { total, data, success } = await run(payload);
      if (!success) throw new Error('request response error');
      const items = reset ? data : [...state.items, ...data];
      const hasMore = items.length < total;
      set({ items, hasMore });
      paginationRef.current = { current: payload.current + 1, pageSize: pagi.pageSize, total };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  React.useEffect(() => {
    initRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    onLoad(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  const attrs = {
    hasMore: state.hasMore,
    dataLength: state.items.length,
    loader,
    endMessage,
    scrollThreshold: 1,
    next: onLoad,
  };

  const renderContent = () => {
    return (
      <InfiniteScroll {...attrs}>
        {masonryProps ? (
          <Masorny {...masonryProps}>{state.items.map(row)}</Masorny>
        ) : (
          state.items.map(row)
        )}
      </InfiniteScroll>
    );
  };

  if (pulldown) return <PullRefresh refresh={() => onLoad(true)}>{renderContent()}</PullRefresh>;
  return renderContent();
}
