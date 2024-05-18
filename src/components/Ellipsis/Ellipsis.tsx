import React, { FC, useMemo, useRef, useState } from 'react';
import { useResizeEffect } from './helper';
import { useIsomorphicLayoutEffect } from 'ahooks';
import { merge } from 'lodash';
import { Box, BoxProps } from '@chakra-ui/react';

export type EllipsisProps = {
  content: string;
  rows?: number;
  renderToggle?: (isOpen: boolean, toggle: () => void) => React.ReactNode;
} & BoxProps;

const defaultProps = {
  rows: 1,
};

export const Ellipsis: FC<EllipsisProps> = (p) => {
  const props = merge(defaultProps, p);
  const rootRef = useRef<HTMLDivElement>(null);
  const { rows, content, renderToggle, ...boxProps } = props;

  const [expanded, setExpanded] = useState(false);
  const [exceeded, setExceeded] = useState(false);

  function calcEllipsised() {
    const root = rootRef.current;
    if (!root) return;
    if (!root.offsetParent) return;
    const originStyle = window.getComputedStyle(root);
    const container = document.createElement('div');
    const styleNames: string[] = Array.prototype.slice.apply(originStyle);
    styleNames.forEach((name) => {
      container.style.setProperty(name, originStyle.getPropertyValue(name));
    });
    container.style.position = 'fixed';
    container.style.left = '999999px';
    container.style.top = '999999px';
    container.style.zIndex = '-1000';
    container.style.height = 'auto';
    container.style.minHeight = 'auto';
    container.style.maxHeight = 'auto';
    container.style.textOverflow = 'clip';
    container.style.whiteSpace = 'normal';
    container.style.webkitLineClamp = 'unset';
    container.style.display = 'block';

    const lineHeight = pxToNumber(originStyle.lineHeight);
    const maxHeight = Math.floor(
      lineHeight * (rows + 0.5) +
        pxToNumber(originStyle.paddingTop) +
        pxToNumber(originStyle.paddingBottom),
    );

    container.innerText = content;
    document.body.appendChild(container);

    if (container.offsetHeight <= maxHeight) {
      setExceeded(false);
    } else {
      setExceeded(true);
    }
    document.body.removeChild(container);
  }

  useResizeEffect(calcEllipsised, rootRef);
  useIsomorphicLayoutEffect(() => {
    calcEllipsised();
  }, [content, rows]);

  const toggle = () => {
    setExpanded((v) => !v);
  };

  const computedRows = useMemo(() => {
    if (exceeded && expanded) return undefined;
    return rows;
  }, [exceeded, expanded, rows]);

  return (
    <Box {...boxProps}>
      <Box noOfLines={computedRows} ref={rootRef}>
        {content}
      </Box>
      {exceeded && renderToggle?.(expanded, toggle)}
    </Box>
  );
};

function pxToNumber(value: string | null): number {
  if (!value) return 0;
  const match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}
