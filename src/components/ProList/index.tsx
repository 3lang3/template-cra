import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRequest } from 'ahooks';
import { PAGINATION } from '@/config/constant';
import { ListDone, ListEmpty, ListError, ListLoader } from '../Chore';

export type ActionType<T = unknown> = {
  /** 刷新列表 */
  reload: () => void;
} & T;

type ProListProps<T = unknown> = {
  /** 列表请求的service */
  request: (params?: any) => Promise<any>;
  /** 行渲染方法 */
  row: (row: T, idx: number) => React.ReactNode;
  /** 额外参数 */
  params?: Record<string, any>;
  /** 空状态ui */
  emptyRender?: () => React.ReactNode;
};

export default forwardRef<ActionType, ProListProps>((props, ref) => {
  const { params = {}, emptyRender = () => <ListEmpty /> } = props;
  const [list, setList] = useState<any[]>([]);
  const paginationRef = useRef(PAGINATION.DEFAULT);
  const nomoreRef = useRef(false);

  const { error, run } = useRequest(props.request, {
    manual: true,
    onSuccess: ({ data: { _list, _page }, type, msg }) => {
      if (type === 1) throw Error(msg);
      paginationRef.current = _page;
      nomoreRef.current = _page.page >= _page.totalPage;
      setList([...list, ..._list]);
    },
  });

  const reload = () => {
    setList([]);
    paginationRef.current = PAGINATION.DEFAULT;
    run(params);
  };

  const loadmore = () => {
    run({ ...params, page: paginationRef.current.page + 1 });
  };

  // params变动 列表刷新
  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useImperativeHandle(ref, () => ({
    reload,
  }));

  if (error && !list.length) return <ListError />;

  if (!list.length && nomoreRef.current) return <>{emptyRender()}</>;

  return (
    <InfiniteScroll
      scrollThreshold={1}
      dataLength={list.length}
      next={loadmore}
      hasMore={!nomoreRef.current}
      loader={<ListLoader />}
      endMessage={<ListDone />}
    >
      {list.map(props.row)}
    </InfiniteScroll>
  );
});
