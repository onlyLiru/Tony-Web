import { useMounted } from '@/hooks/useMounted';
import { Box, Flex, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import {
  Area,
  Bar,
  ComposedChart,
  Tooltip,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

const demoData = [
  {
    timestamp: 'Page A',
    value: 1400,
    pv: 2400,
    unit: 'ETH',
  },
  {
    timestamp: 'Page B',
    value: 3000,
    pv: 1398,
    unit: 'ETH',
  },
  {
    timestamp: 'Page C',
    value: 2000,
    pv: 9800,
    unit: 'ETH',
  },
  {
    timestamp: 'Page D',
    value: 2780,
    pv: 3908,
    unit: 'ETH',
  },
  {
    timestamp: 'Page E',
    value: 1890,
    pv: 4800,
    unit: 'ETH',
  },
  {
    timestamp: 'Page F',
    value: 2390,
    pv: 3800,
    unit: 'ETH',
  },
  {
    timestamp: 'Page G',
    value: 3490,
    unit: 'ETH',
  },
];

export type ChartDataType = {
  timestamp: string | number;
  value: number | string;
  unit: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Flex
        direction="column"
        justify="space-between"
        fontSize="sm"
        color="primary.main"
        boxShadow="lg"
        rounded="lg"
        bg="white"
        p={4}
        w={'170px'}
        h="80px"
      >
        <Text fontWeight={'bold'}>
          {format(new Date(label), 'dd MMM,yyy HH:mm')}
        </Text>
        <Flex justify="space-between">
          <Text color="typo.sec">Price:</Text>
          <Text>
            {payload[0].payload.value}
            {payload[0].payload.unit}
          </Text>
        </Flex>
      </Flex>
    );
  }

  return null;
};

export function AreaWithBarChart({ data }: { data: ChartDataType[] }) {
  const isMounted = useMounted();
  if (!isMounted) return null;
  return (
    <Box h="180px" maxW={'full'}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data || demoData}
          margin={{ top: 5, left: 5, right: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#5B46DF" stopOpacity={1} />
              <stop offset="100%" stopColor="#D9D9D9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip content={<CustomTooltip />} />
          <Area
            animationDuration={0}
            strokeWidth={4}
            dataKey="value"
            activeDot={{ r: 7, strokeWidth: 4, stroke: '#fff' }}
            stroke="#5B46DF"
            fill="url(#colorUv)"
          />
          <Bar
            barSize={10}
            animationDuration={0}
            type="monotone"
            dataKey="value"
            fill="rgba(91, 70, 223, 0.1)"
          />
          <XAxis
            dataKey="timestamp"
            hide
            scale="point"
            tickSize={10}
            tick
            tickFormatter={(v) => `${format(new Date(v), 'dd/MM')}`}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
