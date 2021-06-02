/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import './masonry.less';

const DEFAULT_COLUMNS = 2;

const CLS_PREFIX = 'local-masonry-grid';

type BreakpointColsProps = number | { default: number; [key: number]: number };

export type MasonryCssProps = {
  breakpointCols?: BreakpointColsProps;
  className?: string;
  columnClassName?: string;
  children: React.ReactNode;
  /**
   * Custom attributes, however it is advised against
   * using these to prevent unintended issues and future conflicts
   * ...any other attribute, will be added to the container
   */
  columnAttrs?: any;
  /**
   * It is an alias of the `columnAttrs` property
   * @deprecated The column property is deprecated.
   */
  column?: any;
};

function getInitColumnCount(props) {
  let columnCount;
  if (props.breakpointCols && props.breakpointCols.default) {
    columnCount = props.breakpointCols.default;
  } else {
    columnCount = parseInt(props.breakpointCols, 10) || DEFAULT_COLUMNS;
  }

  return columnCount;
}

const Masonry = (props: MasonryCssProps): any => {
  const [columnCount, setColumnCount] = useState<number>(() => getInitColumnCount(props));

  const lastRecalculateAnimationFrameRef = useRef<any>(null);

  const reCalculateColumnCount = useCallback(() => {
    const windowWidth = (window && window.innerWidth) || Infinity;
    let breakpointColsObject = props.breakpointCols;

    // Allow passing a single number to `breakpointCols` instead of an object
    if (typeof breakpointColsObject !== 'object') {
      breakpointColsObject = {
        default: parseInt((breakpointColsObject as unknown) as string, 10) || DEFAULT_COLUMNS,
      };
    }

    let matchedBreakpoint = Infinity;
    let columns = breakpointColsObject.default || DEFAULT_COLUMNS;

    for (const breakpoint in breakpointColsObject) {
      const optBreakpoint = parseInt(breakpoint, 10);
      const isCurrentBreakpoint = optBreakpoint > 0 && windowWidth <= optBreakpoint;

      if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
        matchedBreakpoint = optBreakpoint;
        columns = breakpointColsObject[breakpoint];
      }
    }

    columns = Math.max(1, parseInt((columns as unknown) as string, 10) || 1);
    if (columnCount !== columns) {
      setColumnCount(columns);
    }
  }, [columnCount, props.breakpointCols]);

  const reCalculateColumnCountDebounce = useCallback(() => {
    if (!window || !window.requestAnimationFrame) {
      // IE10+
      reCalculateColumnCount();
      return;
    }

    if (window.cancelAnimationFrame) {
      // IE10+
      window.cancelAnimationFrame(lastRecalculateAnimationFrameRef.current);
    }

    lastRecalculateAnimationFrameRef.current = window.requestAnimationFrame(() => {
      reCalculateColumnCount();
    });
  }, [reCalculateColumnCount]);

  const itemsInColumns = () => {
    const currentColumnCount = columnCount;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const itemsInColumns = new Array(currentColumnCount);

    // Force children to be handled as an array
    const items = [].concat((props.children || []) as []);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < items.length; i++) {
      const columnIndex = i % currentColumnCount;

      if (!itemsInColumns[columnIndex]) {
        itemsInColumns[columnIndex] = [];
      }

      itemsInColumns[columnIndex].push(items[i]);
    }

    return itemsInColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const renderColumns = () => {
    const { column, columnAttrs = {}, columnClassName } = props;
    const childrenInColumns = itemsInColumns();
    const columnWidth = `${100 / childrenInColumns.length}%`;
    const className = cn(`${CLS_PREFIX}__column`, columnClassName);

    const columnAttributes = {
      // NOTE: the column property is undocumented and considered deprecated.
      // It is an alias of the `columnAttrs` property
      ...column,
      ...columnAttrs,
      style: {
        ...columnAttrs.style,
        width: columnWidth,
      },
      className,
    };

    return childrenInColumns.map((items, i) => {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <div {...columnAttributes} key={i}>
          {items}
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    reCalculateColumnCount();

    // window may not be available in some environments
    if (window) {
      window.addEventListener('resize', reCalculateColumnCountDebounce);
    }
    return () => {
      if (window) {
        window.removeEventListener('resize', reCalculateColumnCountDebounce);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    // ignored
    children,
    breakpointCols,
    columnClassName,
    columnAttrs,
    column,

    // used
    className,

    ...rest
  } = props;

  const classNameOutput = cn(CLS_PREFIX, className);

  return (
    <div {...rest} className={classNameOutput}>
      {renderColumns()}
    </div>
  );
};

export default Masonry;
