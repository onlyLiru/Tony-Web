import { useTranslations } from 'next-intl';
import { Box } from '@chakra-ui/react';
import AgentTable from './AgentTable';
import { userList } from '@/services/agent';
import { formatAmount } from './WithdrawTabPanel';

const UserTabPanel = () => {
  const t = useTranslations('promoter');

  const columns = [
    {
      title: t('nickname'),
      key: 'nick_name',
      search: true,
    },
    {
      title: 'Link',
      key: 'description',
      search: true,
    },
    {
      title: 'Type',
      key: 'type',
      render: (record: any) => (record.type === 2 ? '会员' : '代理'),
    },
    {
      title: 'Order amount',
      key: 'deal_amount',
      render: (record: any) => formatAmount(record.deal_amount),
    },
    {
      title: 'Toady amout',
      key: 'day_deal_amount',
      render: (record: any) => formatAmount(record.day_deal_amount),
    },
    {
      title: 'Rebate',
      key: 'recommission',
      render: (record: any) => formatAmount(record.recommission),
    },
  ];
  return (
    <Box p={{ md: '35px 40px 100px', base: '20px 12px 60px' }}>
      <AgentTable columns={columns} request={userList} />
    </Box>
  );
};

export default UserTabPanel;
