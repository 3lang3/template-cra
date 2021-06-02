/* eslint-disable no-underscore-dangle */
import { useRequest, useSetState } from 'ahooks';
import * as React from 'react';
import type { Props as InfiniteScrollProps } from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroll-component';

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

type ListProps = {
  children: React.ReactNode[];
  onLoad: () => void;
} & Partial<Omit<InfiniteScrollProps, 'next' | 'dataLength' | 'hasMore'>>;

export const List = ({
  children,
  onLoad,
  loader = <DefaultLoader />,
  endMessage = <DefaultEndMessage />,
  ...props
}: ListProps) => {
  return (
    <InfiniteScroll
      hasMore={true}
      dataLength={React.Children.count(children)}
      loader={loader}
      endMessage={endMessage}
      next={onLoad}
      {...props}
    >
      {children}
    </InfiniteScroll>
  );
};

type ProListProps<T> = {
  row: (item: T, index: number, itemArr: T[]) => React.ReactNode;
  request: (params: { pageSize: number; current: number }) => void;
  params?: Record<string, any>;
} & Omit<ListProps, 'onLoad' | 'children'>;

export function ProList<T = Record<string, any>>({
  request,
  row,
  loader = <DefaultLoader />,
  endMessage = <DefaultEndMessage />,
  params = {},
}: ProListProps<T>) {
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
      const items = [...state.items, ...data];
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

  return (
    <InfiniteScroll
      hasMore={state.hasMore}
      dataLength={state.items.length}
      loader={loader}
      endMessage={endMessage}
      scrollThreshold={1}
      next={onLoad}
    >
      {state.items.map(row)}
    </InfiniteScroll>
  );
}
