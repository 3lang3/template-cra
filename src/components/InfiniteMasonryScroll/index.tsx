/* eslint-disable no-underscore-dangle */
import type { MasonryCssProps } from '@/components/Masonry';
import Masorny from '@/components/Masonry';
import useRequest from '@ahooksjs/use-request';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Props as InfiniteScrollProps } from 'react-infinite-scroll-component';
import InfiniteScroll from 'react-infinite-scroll-component';

type InfiniteMasonryScrollProps = {
  masonryProps?: Omit<MasonryCssProps, 'children'>;
} & InfiniteScrollProps;

export default ({ children, masonryProps, ...props }: InfiniteMasonryScrollProps) => {
  return (
    <InfiniteScroll {...props}>
      <Masorny {...masonryProps}>{children}</Masorny>
    </InfiniteScroll>
  );
};

type useInfiniteMasonryReturnType<T> = { items: T[]; scrollProps: any };

type ServiceResponseType = {
  list: any[];
  total: number;
};

type ServiceType = {
  ({ current, pageSize }: any): Promise<ServiceResponseType>;
};

export function useInfiniteMasonry<T>(service: ServiceType): useInfiniteMasonryReturnType<T> {
  const [items, setItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pagiRef = useRef<any>({ page: 0, pageSize: 10 });
  const { run, loading, ...rest } = useRequest(service, {
    defaultParams: [{ ...pagiRef.current }],
    manual: true,
  });

  const next = async () => {
    if (loading || !hasMore) return;
    try {
      const { type, msg, data }: any = await run({
        page: Number(pagiRef.current.page) + 1,
        pageSize: pagiRef.current.pageSize,
      });
      if (type === 1) throw Error(msg);
      setHasMore(data._page.page * 1 < data._page.totalPage);
      setItems((v) => [...v, ...data._list]);
      pagiRef.current = data._page;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  useEffect(() => {
    next();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataLength = useMemo(() => items.length, [items]);

  const scrollProps = {
    hasMore,
    dataLength,
    next,
  };

  return { items, loading, scrollProps, ...rest } as useInfiniteMasonryReturnType<T>;
}
