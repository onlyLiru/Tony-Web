import { useTranslations } from 'next-intl';
import { Box, Text } from '@chakra-ui/react';
import AgentTable from './AgentTable';
import { withdrawList } from '@/services/agent';
import { DateRangePicker } from '@/features/DatePicker';
import { format } from 'date-fns';
import { formatEther } from 'ethers/lib/utils.js';

const WithdrawTabPanel = () => {
  const t = useTranslations('promoter');

  const columns = [
    {
      title: t('order'),
      key: 'order_id',
      search: true,
    },
    {
      title: t('previousBalance'),
      key: 'before_amount',
      render: (record: any) => formatAmount(record.before_amount),
    },
    {
      title: t('withdrawalAmount'),
      key: 'submit_amount',
      render: (record: any) => formatAmount(record.submit_amount),
    },
    {
      title: t('postWithdrawlBalance'),
      key: 'after_amount',
      render: (record: any) => formatAmount(record.after_amount),
    },
    {
      title: t('status'),
      key: 'status',
      render: (record: any) => (
        <Box fontSize="14px" lineHeight="24px" fontWeight={700}>
          {record.status === 0 ? (
            <Text color="#7065F0">待提现</Text>
          ) : (
            <Text color="#040415">已提现</Text>
          )}
        </Box>
      ),
    },
    {
      title: t('withdrawalTime'),
      key: 'created_at',
      render: (record: any) =>
        format(new Date(record.created_at * 1000), 'MM/dd/yyyy HH:mm:ss'),
    },
    {
      title: t('date'),
      key: 'start_time',
      search: true,
      hideInTable: true,
      transform: {
        output: (v: any) => ({
          start_time: new Date(v.from).getTime() / 1000,
          end_time: new Date(v.to).getTime() / 1000,
        }),
        input: (v: any) => ({
          from: v.start_time ? new Date(v.start_time * 1000) : undefined,
          to: v.end_time ? new Date(v.end_time * 1000) : undefined,
        }),
      },
      renderFormItem: (option: any) => <DateRangePicker {...option} />,
    },
  ];
  return (
    <Box p={{ md: '35px 40px 100px', base: '20px 12px 60px' }}>
      <AgentTable columns={columns} request={withdrawList} />
    </Box>
  );
};

export default WithdrawTabPanel;

export function formatAmount(amount: string) {
  return amount
    ? Math.floor(Number(formatEther(amount)) * 1000000) / 1000000
    : 0;
}
