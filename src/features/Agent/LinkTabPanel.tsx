import { useTranslations } from 'next-intl';
import { Box, HStack, Text } from '@chakra-ui/react';
import AgentTable, { AgentTablekRef } from './AgentTable';
import { DateRangePicker } from '@/features/DatePicker';
import { format } from 'date-fns';
import { inviteList } from '@/services/agent';
import { useState, useRef } from 'react';
import { InvalidateLinkModal, InvalidateLinkRef } from './InvalidateLinkModal';
import { formatAmount } from './WithdrawTabPanel';

const LinkTabPanel = () => {
  const tableRef = useRef<AgentTablekRef>(null);
  const invalidateLinkRef = useRef<InvalidateLinkRef>(null);
  const t = useTranslations('promoter');

  const [extraData, setExtraData] = useState<{
    list_count: number;
    list_useful: number;
  }>();

  const handleInvalidate = async (code: string) => {
    invalidateLinkRef.current?.open({ code });
  };

  const columns = [
    {
      title: 'Link',
      key: 'id',
    },
    {
      title: t('remarks'),
      key: 'description',
      search: true,
    },
    {
      title: t('friendsInvited'),
      key: 'invited_num',
    },
    {
      title: t('rebateAmount'),
      key: 'amount',
      render: (record: any) => formatAmount(record.amount),
    },
    {
      title: t('status'),
      key: 'status',
      render: (record: any) => (
        <Box fontSize="14px" fontWeight={700}>
          {record.status === 1 ? (
            <Text color="#4B9F47">Normal</Text>
          ) : (
            <Text color="#C4C4C4">Invalid</Text>
          )}
        </Box>
      ),
    },
    {
      title: t('date'),
      key: 'start_time',
      search: true,
      transformKeys: ['start_time', 'end_time'],
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
      render: (record: any) =>
        format(new Date(record.created * 1000), 'MM/dd/yyyy'),
    },
    {
      title: 'Operate',
      key: 'option',
      render: (record: any) =>
        record.status === 1 ? (
          <Text
            textDecoration="underline"
            color="#4285F4"
            fontSize="14px"
            onClick={() => handleInvalidate(record.code)}
          >
            invalidate the invitation
          </Text>
        ) : null,
    },
  ];
  return (
    <Box p={{ md: '35px 40px 100px', base: '20px 12px 60px' }}>
      <AgentTable
        columns={columns}
        request={inviteList}
        ref={tableRef}
        topRender={() => (
          <HStack
            spacing="30px"
            mb="10px"
            fontSize="16px"
            lineHeight="22px"
            fontWeight={700}
            fontFamily="Plus Jakarta Sans"
            pl="10px"
          >
            <Text>
              {t('numberOfLinks')}：{extraData?.list_count}
            </Text>
            <Text>
              {t('activeLinks')}：{extraData?.list_useful}
            </Text>
          </HStack>
        )}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onRequestSuccess={({ list, total, ...res }) => {
          setExtraData(res);
        }}
      />
      <InvalidateLinkModal
        ref={invalidateLinkRef}
        refresh={tableRef.current?.reload}
      />
    </Box>
  );
};

export default LinkTabPanel;
