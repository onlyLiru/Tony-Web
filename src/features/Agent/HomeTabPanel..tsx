import { useTranslations } from 'next-intl';
import {
  Box,
  HStack,
  Text,
  Button,
  createIcon,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import { AgentContext } from './Context';
import { useContext } from 'react';
import { useWithdrawEvent } from './useWithdrawEvent';
import { useSwitchChain } from '@/hooks/useSwitchChain';
import { defaultChainId } from '@/store';
import { formatAmount } from './WithdrawTabPanel';

export const TipIcon = createIcon({
  displayName: 'tip Icon',
  viewBox: '0 0 24 24',
  path: [
    <svg
      key=""
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.048 0.271973C12.536 0.271973 13.932 0.555973 15.236 1.12397C16.54 1.69197 17.68 2.45997 18.656 3.42797C19.632 4.39597 20.4 5.53197 20.96 6.83597C21.52 8.13997 21.8 9.53597 21.8 11.024C21.8 12.512 21.52 13.904 20.96 15.2C20.4 16.496 19.632 17.632 18.656 18.608C17.68 19.584 16.54 20.352 15.236 20.912C13.932 21.472 12.536 21.752 11.048 21.752C9.56001 21.752 8.16801 21.472 6.87201 20.912C5.57601 20.352 4.44001 19.584 3.46401 18.608C2.48801 17.632 1.72001 16.496 1.16001 15.2C0.600007 13.904 0.320007 12.512 0.320007 11.024C0.320007 9.53597 0.600007 8.13997 1.16001 6.83597C1.72001 5.53197 2.48801 4.39597 3.46401 3.42797C4.44001 2.45997 5.57601 1.69197 6.87201 1.12397C8.16801 0.555973 9.56001 0.271973 11.048 0.271973ZM11.072 18.368C11.488 18.368 11.836 18.228 12.116 17.948C12.396 17.668 12.536 17.328 12.536 16.928C12.536 16.512 12.396 16.164 12.116 15.884C11.836 15.604 11.488 15.464 11.072 15.464C10.656 15.464 10.308 15.604 10.028 15.884C9.74801 16.164 9.60801 16.512 9.60801 16.928C9.60801 17.328 9.74801 17.668 10.028 17.948C10.308 18.228 10.656 18.368 11.072 18.368ZM12.296 12.464C12.28 12.208 12.44 11.936 12.776 11.648C13.112 11.36 13.488 11.04 13.904 10.688C14.32 10.336 14.704 9.93997 15.056 9.49997C15.408 9.05997 15.6 8.55197 15.632 7.97597C15.664 7.35197 15.6 6.76797 15.44 6.22397C15.28 5.67997 15.016 5.21197 14.648 4.81997C14.28 4.42797 13.804 4.11597 13.22 3.88397C12.636 3.65197 11.952 3.53597 11.168 3.53597C10.192 3.53597 9.38001 3.70797 8.73201 4.05197C8.08401 4.39597 7.56001 4.81197 7.16001 5.29997C6.76001 5.78797 6.48001 6.29197 6.32001 6.81197C6.16001 7.33197 6.08801 7.76797 6.10401 8.11997C6.12001 8.53597 6.25201 8.83997 6.50001 9.03197C6.74801 9.22397 7.01601 9.32397 7.30401 9.33197C7.59201 9.33997 7.85601 9.25997 8.09601 9.09197C8.33601 8.92397 8.45601 8.67997 8.45601 8.35997C8.45601 8.16797 8.51601 7.93197 8.63601 7.65197C8.75601 7.37197 8.92001 7.10397 9.12801 6.84797C9.33601 6.59197 9.58801 6.37597 9.88401 6.19997C10.18 6.02397 10.512 5.93597 10.88 5.93597C11.6 5.93597 12.176 6.11597 12.608 6.47597C13.04 6.83597 13.24 7.28797 13.208 7.83197C13.208 8.10397 13.128 8.35597 12.968 8.58797C12.808 8.81997 12.604 9.04397 12.356 9.25997C12.108 9.47597 11.844 9.69197 11.564 9.90797C11.284 10.124 11.02 10.348 10.772 10.58C10.524 10.812 10.316 11.064 10.148 11.336C9.98001 11.608 9.88801 11.904 9.87201 12.224L9.89601 13.136C9.89601 13.376 10.008 13.604 10.232 13.82C10.456 14.036 10.752 14.152 11.12 14.168C11.488 14.152 11.78 14.032 11.996 13.808C12.212 13.584 12.312 13.328 12.296 13.04V12.464Z"
        fill="currentColor"
      />
    </svg>,
  ],
});

const HomeTab = () => {
  const t = useTranslations('promoter');
  const { data, refresh } = useContext(AgentContext);
  const agentInfo = data?.agent_info || {};
  const boardInfo = data?.board_info || {};
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { loading, withdraw } = useWithdrawEvent();

  const { needSwitchChain, switchChain } = useSwitchChain({
    fixedChainId: defaultChainId,
  });

  const handleWithdraw = async () => {
    if (needSwitchChain) return switchChain();
    await withdraw();
    refresh();
  };

  return (
    <Box p={{ md: '66px 60px', base: '20px 10px 50px' }}>
      <HStack
        justify="space-between"
        fontSize={{ md: '24px', base: '14px' }}
        mb={{ md: '25px', base: '12px' }}
      >
        <HStack spacing="14px">
          <Text pl="10px">{t('promoterName')}:</Text>
          <Text fontWeight={700}>{agentInfo.nick_name}</Text>
        </HStack>
        <HStack spacing="10px" hidden={!isLargerThan768}>
          <Text fontSize="20px" fontWeight={700} color="#7178FF">
            {formatAmount(agentInfo.amount)} ETH
          </Text>
          <Button
            fontSize="18px"
            rounded="full"
            color="#fff"
            bg="#7065F0"
            _hover={{ opacity: 0.8 }}
            onClick={handleWithdraw}
            isLoading={loading}
            isDisabled={agentInfo.status === 1}
          >
            {t('withdrawal')}
          </Button>
        </HStack>
      </HStack>
      <Stack
        direction={{ md: 'row', base: 'column' }}
        w="full"
        h={{ md: '200px', base: '287px' }}
        bg="#F9F9FE"
        rounded={{ md: '12px', base: '8px' }}
        // justify="space-between"
        align="center"
        p={{ md: '0 79px', base: '22px 20px' }}
        fontFamily="Plus Jakarta Sans"
        lineHeight="24px"
        fontSize={{ md: '20px', base: '14px' }}
        fontWeight={600}
        color="#777E90"
        mb={{ md: '60px', base: '15px' }}
        spacing="120px"
      >
        <Stack
          direction={{ md: 'column', base: 'row' }}
          justify="center"
          align="center"
          spacing={{ md: '10px', base: '55px' }}
          w={{ md: '200px', base: 'full' }}
        >
          <Text
            h={{ md: '48px', base: 'auto' }}
            w={{ md: 'auto', base: '140px' }}
          >
            {t('promoterType')}
          </Text>
          <Text
            color="#7065F0"
            fontWeight={700}
            w={{ md: 'auto', base: '120px' }}
            textAlign="center"
          >
            {+agentInfo.type === 2 ? t('Team') : t('Personal')}
          </Text>
        </Stack>
        <Stack
          direction={{ md: 'column', base: 'row' }}
          justify="center"
          align="center"
          spacing={{ md: '10px', base: '55px' }}
          w={{ md: '200px', base: 'full' }}
        >
          <Text
            h={{ md: '48px', base: 'auto' }}
            w={{ md: 'auto', base: '140px' }}
          >
            {t('promoterLevel')}
          </Text>
          <Text
            color="#7065F0"
            fontWeight={700}
            w={{ md: 'auto', base: '120px' }}
            h="28px"
            textAlign="center"
          >
            {agentInfo.level}
          </Text>
        </Stack>
        {/* <Stack
          direction={{ md: 'column', base: 'row' }}
          justify="center"
          align="center"
          spacing={{ md: '10px', base: '55px' }}
          w={{ md: '200px', base: 'full' }}
        >
          <Text
            h={{ md: '48px', base: 'auto' }}
            w={{ md: 'auto', base: '140px' }}
          >
            Friends'rebate rate
          </Text>
          <HStack
            spacing="4px"
            w={{ md: 'auto', base: '120px' }}
            justify="center"
          >
            <Text color="#7065F0" fontWeight={700}>
              {`${agentInfo.ratio}%`}
            </Text>
            <TipIcon color="#AAA3FF" display={{ md: 'block', base: 'none' }} />
          </HStack>
        </Stack>
        <Stack
          direction={{ md: 'column', base: 'row' }}
          justify="center"
          align="center"
          spacing={{ md: '10px', base: '55px' }}
          w={{ md: '200px', base: 'full' }}
        >
          <Text
            h={{ md: '48px', base: 'auto' }}
            textAlign="center"
            w={{ md: 'auto', base: '140px' }}
          >
            Rebate rate of non-direct friends
          </Text>
          <Center
            color="#7065F0"
            fontWeight={700}
            w={{ md: 'auto', base: '120px' }}
            textAlign="center"
          >
            5%
          </Center>
        </Stack> */}
      </Stack>
      <HStack
        spacing="10px"
        hidden={isLargerThan768}
        justify="flex-end"
        mb="50px"
      >
        <Text fontSize="14px" fontWeight={700} color="#7178FF">
          {formatAmount(agentInfo.amount)} ETH
        </Text>
        <Button
          w="100px"
          h="30px"
          fontSize="14px"
          rounded="full"
          color="#fff"
          bg="#7065F0"
          _hover={{ opacity: 0.8 }}
          onClick={handleWithdraw}
          isLoading={loading}
          isDisabled={agentInfo.status === 1}
        >
          {t('withdrawal')}
        </Button>
      </HStack>
      <Text
        fontSize={{ md: '24px', base: '14px' }}
        lineHeight={{ md: '35px', base: '20px' }}
        mb="20px"
      >
        {t('dashboard')}
      </Text>
      <Stack
        direction={{ md: 'row', base: 'column' }}
        align="center"
        w="full"
        h={{ md: '200px', base: '272px' }}
        bg="#F9F9FE"
        rounded={{ md: '12px', base: '8px' }}
        justify="space-between"
        p={{ md: '0 90px', base: '20px 15px' }}
        fontFamily="Plus Jakarta Sans"
        lineHeight="20px"
        fontSize={{ md: '18px', base: '14px' }}
        fontWeight={600}
        color="#777E90"
      >
        <Stack
          direction={{ md: 'column', base: 'row' }}
          spacing={{ md: '6px', base: '70px' }}
          align="flex-start"
        >
          <HStack spacing="12px" w={{ md: 'auto', base: '130px' }}>
            <Text h="24px">{t('newUsers')}</Text>
            {/* <TipIcon color="#D7D7D7" /> */}
          </HStack>
          <Text
            lineHeight="32px"
            fontSize={{ md: '36px', base: '14px' }}
            color="#23262F"
            w={{ md: 'auto', base: '120px' }}
            textAlign="center"
          >
            {boardInfo.today_new_members}
          </Text>
        </Stack>
        <Stack
          direction={{ md: 'column', base: 'row' }}
          spacing={{ md: '6px', base: '70px' }}
          align="flex-start"
        >
          <HStack spacing="12px" w={{ md: 'auto', base: '130px' }}>
            <Text h="24px">{t('userNumber')}</Text>
            {/* <TipIcon color="#D7D7D7" /> */}
          </HStack>
          <Text
            lineHeight="32px"
            fontSize={{ md: '36px', base: '14px' }}
            color="#23262F"
            w={{ md: 'auto', base: '120px' }}
            textAlign="center"
          >
            {boardInfo.total_members}
          </Text>
        </Stack>
        <Stack
          direction={{ md: 'column', base: 'row' }}
          spacing={{ md: '6px', base: '70px' }}
          align="flex-start"
        >
          <HStack spacing="12px" w={{ md: 'auto', base: '130px' }}>
            <Text h="24px">{t('todayRebate')}</Text>
            {/* <TipIcon color="#D7D7D7" /> */}
          </HStack>
          <Text
            lineHeight="32px"
            fontSize={{ md: '36px', base: '14px' }}
            color="#23262F"
            w={{ md: 'auto', base: '120px' }}
            textAlign="center"
          >
            {boardInfo.today_new_members}
          </Text>
        </Stack>
        <Stack
          direction={{ md: 'column', base: 'row' }}
          spacing={{ md: '6px', base: '70px' }}
          align="flex-start"
        >
          <HStack spacing="12px" w={{ md: 'auto', base: '130px' }}>
            <Text h="24px" whiteSpace="nowrap">
              {t('totalRebate')}
            </Text>
            {/* <TipIcon color="#D7D7D7" /> */}
          </HStack>
          <Text
            lineHeight="32px"
            fontSize={{ md: '36px', base: '14px' }}
            color="#23262F"
            w={{ md: 'auto', base: '120px' }}
            textAlign="center"
          >
            {formatAmount(boardInfo.total_recommision)}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default HomeTab;
