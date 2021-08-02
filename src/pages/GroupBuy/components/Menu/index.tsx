import { Flex } from 'react-vant';
import { useState } from 'react';
import Pop from '../Pop';
import './index.less';

export type Node = {
  id: number | string;
  value: number | string;
  name: string;
  label: string;
  children: { name: string; id: number | string }[];
};

export type DataNode = {
  label: string;
  value: number;
  active: any | Node;
  activeChild: any | Node;
};

export default ({ list }) => {
  const [data, setData] = useState<DataNode[]>([
    {
      label: '全部商圈',
      value: 1,
      active: null,
      activeChild: null,
    },
    {
      label: '全部餐饮',
      value: 2,
      active: null,
      activeChild: null,
    },
    {
      label: '智能排序',
      value: 3,
      active: null,
      activeChild: null,
    },
  ]);
  const [idx, setIdx] = useState(-1);
  function onRegions(node, val) {
    setIdx(idx === val ? -1 : val);
    if (!node.active) {
      data[val].active = list[val][0];
    }
  }
  function onRight(node) {
    data[idx].activeChild = node;
    data[idx].label = node.name;
    setData(data);
    setIdx(-1);
  }
  function onLeft(node) {
    if (!data[idx].active.children) {
      data[idx].label = node.label;
      setIdx(-1);
    }
    data[idx].active = node;
    setData([...data]);
  }
  return (
    <Flex align="center" className="menu">
      {data.map((item, idx) => (
        <span
          className={`menu__span`}
          onClick={() => onRegions(item, idx)}
          key={item.value}
        >
          {item.label}
        </span>
      ))}

      {idx !== -1 ? (
        <>
          {list[idx].length && (
            <Flex className="menu__body">
              <div
                className={`menu__body--left ${
                  !data[idx].active.children && 'menu__body--left--no'
                }`}
              >
                {list[idx].map((item: Node) => (
                  <p
                    onClick={() => onLeft(item)}
                    className={`${
                      item.value === data[idx].active.value && 'active'
                    }`}
                    key={item.value}
                  >
                    {item.label}
                  </p>
                ))}
              </div>
              {data[idx].active.children && (
                <div className="menu__body--right">
                  {data[idx].active.children.map((record) => (
                    <p
                      className={
                        data[idx].activeChild &&
                        record.id === data[idx].activeChild.id
                          ? 'menu__p--active'
                          : ''
                      }
                      onClick={() => onRight(record)}
                      key={record.id}
                    >
                      {record.name}
                    </p>
                  ))}
                </div>
              )}
            </Flex>
          )}
          <Pop overlayProps={{ onClick: () => setIdx(-1) }} />
        </>
      ) : (
        ''
      )}
    </Flex>
  );
};
