import { useTranslations } from 'next-intl';
import { useRef, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Box, HStack, Text, Button, useToast } from '@chakra-ui/react';
import AgentTable, { AgentTablekRef } from './AgentTable';
import { SettingProxyModal, SettingProxyModalRef } from './SettingProxyModal';
import { agentList, ApiAgent } from '@/services/agent';
import { formatEther } from 'ethers/lib/utils.js';

const AgentTabPanel = () => {
  const settingProxyRef = useRef<SettingProxyModalRef>(null);
  const tableRef = useRef<AgentTablekRef>(null);
  const [canOperate, setCanOperate] = useState(false);
  const t = useTranslations('promoter');

  const onEdit = (row: any) => {
    settingProxyRef.current?.open({
      address: row.wallet_address,
      level: row.level,
    });
  };

  const columns = [
    {
      title: t('nickname'),
      key: 'nick_name',
    },
    {
      title: t('walletAddress'),
      key: 'wallet_address',
      search: true,
      render: (record: any) =>
        `${record.wallet_address.substring(
          0,
          4,
        )}...${record.wallet_address.substring(
          record.wallet_address.length - 3,
        )}`,
    },
    {
      title: t('promoterLevel'),
      key: 'level_name',
    },
    {
      title: t('rebatePercentage'),
      key: 'ratio',
    },
    {
      title: t('numberOfMembers'),
      key: 'friends_num',
    },
    {
      title: t('rebateAmount'),
      key: 'deal_amount',
      render: (record: any) =>
        record.deal_amount
          ? Math.floor(Number(formatEther(record.deal_amount)) * 1000000) /
            1000000
          : 0,
    },
    {
      title: 'Operate',
      key: 'option',
      hideInTable: !canOperate,
      render: (record: any) => (
        <Text
          textDecoration="underline"
          color="#4285F4"
          cursor="pointer"
          onClick={() => onEdit(record)}
        >
          {t('edit')}
        </Text>
      ),
    },
  ];

  const onRequestSuccess = (data: {
    total: number;
    list: ApiAgent.AgentItem[];
    can_operate: boolean;
  }) => {
    setCanOperate(data?.can_operate);
  };
  return (
    <Box p={{ md: '35px 40px 100px', base: '20px 12px 60px' }}>
      <AgentTable
        columns={columns}
        request={agentList}
        ref={tableRef}
        onRequestSuccess={onRequestSuccess}
        rightRender={() =>
          canOperate ? (
            <HStack
              flex={1}
              justify="flex-end"
              maxW={{ md: '490px', base: 'full' }}
            >
              <Button
                w="120px"
                h={{ md: '40px', base: '28px' }}
                fontSize={{ md: '18px', base: '16px' }}
                bgColor="#7065F0"
                fontWeight={700}
                rounded="full"
                cursor="pointer"
                color="#fff"
                _hover={{ opacity: 0.8 }}
                onClick={() => settingProxyRef.current?.open()}
              >
                {t('addPromoter')}
              </Button>
            </HStack>
          ) : undefined
        }
      />
      <SettingProxyModal
        ref={settingProxyRef}
        refresh={() => tableRef.current?.reload()}
      />
    </Box>
  );
};

export default AgentTabPanel;
