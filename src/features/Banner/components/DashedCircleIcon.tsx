import { createIcon, IconProps } from '@chakra-ui/react';

export const DashedCircleIcon = ({
  r,
  strokeWidth = 2,
  strokeDasharray = '12 10',
  ...props
}: IconProps & {
  r: number;
  strokeWidth?: number;
  strokeDasharray?: string;
}) => {
  const w = r * 2;
  const innerR = r - strokeWidth;
  const Ele = createIcon({
    displayName: 'dashed circle border',
    viewBox: `0 0 ${w} ${w}`,
    path: [
      <circle
        key="circle"
        cx={r}
        cy={r}
        r={innerR}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={strokeDasharray}
      />,
    ],
    defaultProps: {
      fill: 'none',
    },
  });
  return <Ele {...props} />;
};
