import type { MutableRefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { ScrollElement } from '../utils';
import { defaultRoot } from '../utils';

const overflowScrollReg = /scroll|auto/i;

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1;
  return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE;
}

export function getScrollParent(el: Element, root: ScrollElement | undefined = defaultRoot) {
  let node = el;

  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY)) {
      return node;
    }
    node = node.parentNode as Element;
  }

  return root;
}

export function useScrollParent(
  el: MutableRefObject<Element | undefined>,
  root: ScrollElement | undefined = defaultRoot,
) {
  const scrollParent = useRef<Element | Window>();

  useEffect(() => {
    if (el.current) {
      scrollParent.current = getScrollParent(el.current, root);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return scrollParent;
}
