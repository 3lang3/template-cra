/* eslint-disable no-underscore-dangle */
import type { MasonryCssProps } from '@/components/Masonry';
import Masorny from '@/components/Masonry';
import useRequest from '@ahooksjs/use-request';
import { useSetState, useUpdateEffect } from 'ahooks';
import { useEffect, useRef } from 'react';
import type { Props as InfiniteScrollProps } from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroll-component';

type InfiniteMasonryScrollProps = {
  masonryProps?: Omit<MasonryCssProps, 'children'>;
} & InfiniteScrollProps;

const InfiniteMasonryScroll = ({
  children,
  masonryProps,
  ...props
}: InfiniteMasonryScrollProps) => {
  return (
    <InfiniteScroll {...props}>
      {masonryProps &&
      typeof masonryProps.breakpointCols === 'number' &&
      masonryProps.breakpointCols <= 1 ? (
        children
      ) : (
        <Masorny {...masonryProps}>{children}</Masorny>
      )}
    </InfiniteScroll>
  );
};

type useInfiniteMasonryReturnType<T> = { items: T[]; scrollProps: any; refresh: any };

type ServiceResponseType = {
  list: any[];
  total: number;
};

type ServiceType = {
  ({ current, pageSize }: any): Promise<ServiceResponseType>;
};

type OptsType = {
  defaultParams?: Record<string, any>;
  defaultPageSize?: number;
  defaultCurrent?: number;
};

export function useInfiniteMasonry<T>(
  service: ServiceType,
  opts?: OptsType,
): useInfiniteMasonryReturnType<T> {
  const [state, setState] = useSetState({ items: [], hasMore: true });
  const pagiRef = useRef<any>({
    page: opts?.defaultCurrent || 1,
    pageSize: opts?.defaultPageSize || 10,
  });
  const { run, loading, ...rest } = useRequest(service, {
    manual: true,
  });

  const getData = async (pagi) => {
    try {
      const { type, msg, data }: any = await run({
        page: pagi.page,
        pageSize: pagi.pageSize,
        ...opts?.defaultParams,
      });
      if (type === 1) throw Error(msg);
      setState((v) => ({
        items: pagi.page * 1 === 1 ? data._list : [...v.items, ...data._list],
        hasMore: data._page.page * 1 < data._page.totalPage,
      }));
      data._page.page = data._page.page * 1 + 1;
      pagiRef.current = data._page;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const next = () => {
    if (loading || !state.hasMore) return;
    getData(pagiRef.current);
  };

  const refresh = () => {
    if (loading) return;
    getData({ page: 1, pageSize: pagiRef.current?.pageSize || 10 });
  };

  useEffect(() => {
    next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataLength = () => state.items.length;

  const scrollProps = {
    hasMore: state.hasMore,
    dataLength,
    next,
  };

  return {
    items: state.items,
    loading,
    scrollProps,
    ...rest,
    refresh,
  } as useInfiniteMasonryReturnType<T>;
}

type ProInfiniteScrollProps<T> = {
  itemRender: (item: T, index: number, itemArr: T[]) => React.ReactNode;
  request: (
    p: { current: number; pageSize: number } & Record<string, any>,
  ) => Promise<{ list: T[]; total: number }>;
  params?: Record<string, any>;
  pagination?: {
    defaultPageSize?: number;
    defaultCurrent?: number;
  };
  pullDownToRefresh?:
    | boolean
    | {
        threshold?: InfiniteScrollProps['pullDownToRefreshThreshold'];
        content?: InfiniteScrollProps['pullDownToRefreshContent'];
        releaseContent?: InfiniteScrollProps['releaseToRefreshContent'];
      };
} & Pick<InfiniteScrollProps, 'scrollThreshold' | 'loader' | 'endMessage'> &
  Pick<MasonryCssProps, 'className' | 'columnClassName' | 'breakpointCols'>;

export const ProInfiniteScroll: <T extends Record<string, any>>(
  props: ProInfiniteScrollProps<T>,
) => JSX.Element = ({
  itemRender,
  request,
  params = {},
  pagination = { defaultPageSize: 10, defaultCurrent: 1 },
  scrollThreshold = 1,
  breakpointCols = 2,
  className = 'my-masonry-grid',
  columnClassName = 'my-masonry-grid_column',
  loader,
  endMessage,
  pullDownToRefresh,
}) => {
  const { items, refresh, scrollProps } = useInfiniteMasonry(request, {
    defaultParams: params,
    ...pagination,
  });

  useUpdateEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  let pullDownProps: any = {};
  if (pullDownToRefresh) {
    pullDownProps = {
      pullDownToRefresh: true,
      refreshFunction: refresh,
      pullDownToRefreshThreshold:
        typeof pullDownToRefresh === 'object' ? pullDownToRefresh.threshold : 50,
      pullDownToRefreshContent:
        typeof pullDownToRefresh === 'object' ? (
          pullDownToRefresh.content
        ) : (
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        ),
      releaseToRefreshContent:
        typeof pullDownToRefresh === 'object' ? (
          pullDownToRefresh.releaseContent
        ) : (
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        ),
    };
  }

  if (pullDownToRefresh) {
    if (typeof pullDownToRefresh === 'boolean') {
      pullDownProps = {
        pullDownToRefresh: true,
        refreshFunction: refresh,
        pullDownToRefreshThreshold: 50,
        pullDownToRefreshContent: (
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        ),
        releaseToRefreshContent: (
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        ),
      };
    }
    if (typeof pullDownToRefresh === 'object') {
      pullDownProps = {
        pullDownToRefresh: true,
        refreshFunction: refresh,
        pullDownToRefreshThreshold: pullDownToRefresh.threshold || 50,
        pullDownToRefreshContent: pullDownToRefresh.content || (
          <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
        ),
        releaseToRefreshContent: pullDownToRefresh.releaseContent || (
          <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
        ),
      };
    }
  }

  return (
    <InfiniteMasonryScroll
      masonryProps={{
        breakpointCols,
        className,
        columnClassName,
      }}
      scrollThreshold={scrollThreshold}
      loader={loader}
      endMessage={endMessage}
      {...scrollProps}
      {...pullDownProps}
    >
      {items.map(itemRender as any)}
    </InfiniteMasonryScroll>
  );
};

export default InfiniteMasonryScroll;
