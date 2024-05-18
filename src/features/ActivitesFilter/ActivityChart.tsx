import { useMounted } from '@/hooks/useMounted';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import {
  Bar,
  ComposedChart,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
} from 'recharts';
import * as marketApis from '@/services/market';
import { useContext, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { EthLogo } from '../TokenBalance';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/utils/formatPrice';
import { ActivitesFilterForm } from './ActivitesFilterForm';
import { useSwitchChain } from '@/hooks/useSwitchChain';

const CustomTooltip = ({ active, payload, label }: any) => {
  const t = useTranslations('common');
  if (active && payload && payload.length) {
    return (
      <VStack
        spacing={1.5}
        fontSize="sm"
        color="typo.sec"
        boxShadow="lg"
        rounded="lg"
        fontFamily={'Inter'}
        bg="white"
        p={4}
        w={'170px'}
      >
        <Text fontWeight={600} fontSize="12px" w="full">
          {format(new Date(label * 1000), 'LLL d,yyy HH:mm')}
        </Text>
        <Flex w="full" justify="space-between">
          <Text>{t('avgPrice')}:</Text>
          <HStack align={'center'} spacing="2px">
            <Text color="primary.main" fontWeight={'bold'}>
              {payload[0].payload.price}
            </Text>
            <EthLogo w="10px" />
          </HStack>
        </Flex>
        <Flex w="full" justify="space-between">
          <Text>{t('vol')}:</Text>
          <HStack align={'center'} spacing="2px">
            <Text color="primary.main" fontWeight={'bold'}>
              {payload[0].payload.total}
            </Text>
            <EthLogo w="10px" />
          </HStack>
        </Flex>
      </VStack>
    );
  }

  return null;
};

const FILTER_OPTIONS = [
  { value: 1, label: '1D' },
  { value: 2, label: '7D' },
  { value: 3, label: '30D' },
];

type ActivityChartProps = {
  contractAddress: string;
  chainId: any;
};

function ActivityChartContent(props: ActivityChartProps) {
  const t = useTranslations('common');
  const [during, setDuring] = useState(3);
  const req = useRequest(marketApis.activityPriceInfo, {
    manual: true,
  });
  const { visitChain } = useSwitchChain();

  useEffect(() => {
    req.run({
      during,
      address: props.contractAddress,
      chain_id: props.chainId,
    });
  }, [during]);

  const getTimestamp = (timestamp: number) => {
    if (Number.isNaN(+timestamp)) return '';
    const date = new Date(timestamp * 1000);
    // 24小时
    if (during === 1) {
      return format(date, 'k:mm');
    }
    return format(date, 'LLL d');
  };

  const chartData = useMemo(() => {
    if (!req.data?.data) return [];
    return req.data?.data.chart_info.reverse().map((el) => ({
      ...el,
      price: formatPrice(el.price, visitChain.nativeCurrency.decimals),
      total: formatPrice(el.total, visitChain.nativeCurrency.decimals),
    }));
  }, [req.data?.data]);

  const noChartData = useMemo(() => {
    if (req.loading) return false;
    if (!req.data?.data?.chart_info) return true;
    if (Array.isArray(req.data?.data?.chart_info)) {
      if (!req.data?.data?.chart_info.length) return true;
      return !req.data?.data?.chart_info.some(
        (el) => +el.price > 0 || +el.total > 0,
      );
    }
    return false;
  }, [req.data, req.loading]);

  return (
    <Box
      px={{ base: 0, md: '100px' }}
      mb="30px"
      pt="50px"
      sx={{
        '& .recharts-cartesian-axis-line': {
          stroke: '#f5f5f5',
        },
      }}
    >
      <Box
        h={{ base: '240px', md: '292px' }}
        maxW={'852px'}
        mx="auto"
        pos="relative"
      >
        {req.loading && (
          <Center bg="white" pos="absolute" inset={0} zIndex={2}>
            <Spinner thickness="3px" colorScheme={'blackAlpha'} />
          </Center>
        )}
        {noChartData && (
          <Center bg="white" pos="absolute" inset={0} zIndex={2}>
            <Text fontSize={{ base: '16px', md: '20px' }} fontWeight={700}>
              {t('activites.noChartData')}
            </Text>
          </Center>
        )}
        <ButtonGroup
          pos="absolute"
          top="-50px"
          right="14px"
          size="sm"
          spacing={0}
          rounded={'md'}
          border="2px solid"
          borderColor={'primary.deepGray'}
          color="primary.gray"
          bg={'#E49F5C'}
        >
          {FILTER_OPTIONS.map((el) => (
            <Button
              isActive={el.value === during}
              onClick={() => setDuring(el.value)}
              key={el.value}
              _hover={{
                color: '#000',
              }}
              _active={{
                color: '#000',
              }}
              bg="#E49F5C"
            >
              {el.label}
            </Button>
          ))}
        </ButtonGroup>
        <ResponsiveContainer width={'100%'} height="100%">
          <ComposedChart
            data={chartData}
            // data={data}
            margin={{
              top: 5,
              right: 5,
              bottom: 5,
              left: 5,
            }}
          >
            <Tooltip content={<CustomTooltip />} />
            <CartesianGrid vertical={false} stroke="#f5f5f5" />
            <XAxis
              xAxisId={'time'}
              style={{ fontSize: 12, color: '#ddd' }}
              dataKey="time"
              tickLine={false}
              tickFormatter={getTimestamp}
            />
            <YAxis
              yAxisId={'total'}
              name="total"
              orientation="left"
              dataKey="total"
              style={{ fontSize: 12, color: '#ddd' }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              yAxisId={'price'}
              orientation="right"
              name="price"
              dataKey="price"
              style={{ fontSize: 12, color: '#ddd' }}
              tickLine={false}
              axisLine={false}
            />

            <Bar
              yAxisId={'total'}
              xAxisId="time"
              dataKey="total"
              barSize={35}
              fill="#5470c6"
            />
            <Line
              yAxisId={'price'}
              xAxisId="time"
              dataKey="price"
              stroke="#9fe081"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export function ActivityChart(props: ActivityChartProps) {
  const isMounted = useMounted();
  const { state } = useContext(ActivitesFilterForm.Context);
  if (!isMounted) return null;
  if (!state.events?.includes('4')) return null;
  return <ActivityChartContent {...props} />;
}
