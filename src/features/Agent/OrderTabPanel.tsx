import { useTranslations } from 'next-intl';
import { Box } from '@chakra-ui/react';
import AgentTable from './AgentTable';
import { orderList } from '@/services/agent';
import { format } from 'date-fns';
import { formatAmount } from './WithdrawTabPanel';

const OrderTabPanel = () => {
  const t = useTranslations('promoter');

  const columns = [
    {
      title: t('order'),
      key: 'order',
    },
    {
      title: t('nickname'),
      key: 'nick_name',
      search: true,
    },
    {
      title: t('affiliatedAgents'),
      key: 'parent_name',
      search: true,
    },
    {
      title: t('totalVolume'),
      key: 'deal_amount',
      render: (record: any) => formatAmount(record.deal_amount),
    },
    {
      title: t('rebateAmount'),
      key: 'recommendation_amount',
      render: (record: any) => formatAmount(record.recommendation_amount),
    },
    {
      title: t('closingTime'),
      key: 'created',
      render: (record: any) =>
        format(new Date(record.created * 1000), 'MM/dd/yyyy HH:mm:ss'),
    },
  ];
  return (
    <Box p={{ md: '35px 40px 100px', base: '20px 12px 60px' }}>
      <AgentTable columns={columns} request={orderList} />
    </Box>
  );
};

export default OrderTabPanel;
