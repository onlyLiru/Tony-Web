import React from 'react';
import {
  Flex,
  VStack,
  Text,
  Button,
  Spinner,
  Box,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { ContractStep, ContractStepType } from '@/hooks/helper/types';
import { CheckCircleIcon, NotAllowedIcon, TimeIcon } from '@chakra-ui/icons';
import { shortCollectionAddress } from '@/utils';
import { AiOutlineLink } from 'react-icons/ai';
import { useTranslations } from 'next-intl';
import { useSwitchChain } from '@/hooks/useSwitchChain';

export type ContractSteps = {
  steps: ContractStep[];
  loading?: boolean;
};

export const ContractSteps = (props: ContractSteps) => {
  const t = useTranslations('common');
  const { visitChain, visitChainSymbols } = useSwitchChain();

  const defaultMessage = {
    title: t('steps.confirmInWallet'),
    desc: t('steps.confirmInWalletDesc'),
  };

  const ContractStepsText: Record<string, { title: string; desc: string }> = {
    [ContractStepType.BUY]: {
      title: t('steps.confirmPurchase'),
      desc: t('steps.confirmPurchaseDesc'),
    },
    [ContractStepType.APPROVE_WETH]: {
      title: t('steps.enableWETHSpending', {
        weth: visitChainSymbols.Wrapper,
      }),
      desc: t('steps.enableWETHSpendingDesc', {
        weth: visitChainSymbols.Wrapper,
      }),
    },
    [ContractStepType.APPROVE_COLLECTION]: {
      title: t('steps.approveCollection'),
      desc: t('steps.approveCollectionDesc'),
    },
    [ContractStepType.LISTING]: {
      title: t('steps.completeListing'),
      desc: t('steps.completeListingDesc'),
    },
    [ContractStepType.CANCEL_LISTING]: {
      title: t('steps.cancelListing'),
      desc: t('steps.cancelListingDesc'),
    },
  };

  if (props.loading)
    return (
      <Box w="full">
        <Spinner mx="auto" thickness="3px" speed="0.65s" size="xl" />
      </Box>
    );
  return (
    <VStack w="full" spacing={2} mt="12px">
      {props.steps.map((step) => {
        const shouldOpen = step.status === 'pending' || step.status === 'faild';
        const message = ContractStepsText[step.type] || defaultMessage;
        return (
          <Box w="full" mt="24px !important" key={step.type}>
            <Flex
              align={'center'}
              color={
                shouldOpen || step.status === 'success'
                  ? 'primary.main'
                  : 'primary.sec'
              }
            >
              {(() => {
                if (step.status === 'pending') return <Spinner size="sm" />;
                if (step.status === 'success')
                  return <CheckCircleIcon fontSize={16} />;
                if (step.status === 'faild')
                  return <NotAllowedIcon fontSize={18} />;
                return <TimeIcon fontSize={16} />;
              })()}
              <Text ml={2} fontWeight={'bold'}>
                {message?.title}
              </Text>
            </Flex>
            {shouldOpen && (
              <Box
                ml={2}
                mt={2}
                pl={4}
                borderLeft="2px solid"
                borderColor={'primary.gray'}
              >
                <Text fontSize={'sm'} color="typo.sec">
                  {message?.desc}
                </Text>
                <Divider my={2} />
                <Flex align={'center'} justify="space-between" fontSize={'sm'}>
                  <Text color="typo.sec">{t('steps.status')}</Text>
                  <Flex align={'center'}>
                    <Text
                      color={
                        step.status === 'faild' ? 'red.400' : 'primary.main'
                      }
                    >
                      {(() => {
                        if (step.tx && step.status === 'pending')
                          return (
                            <>
                              {t('steps.confirmingOnChain')}...
                              {step.tx && (
                                <Text
                                  color="accent.blue"
                                  as="a"
                                  display={'inline-flex'}
                                  alignItems="center"
                                  target={'_blank'}
                                  href={`${visitChain.blockExplorers?.default.url}/tx/${step.tx.hash}`}
                                >
                                  {shortCollectionAddress(step?.tx?.hash)}
                                  <Icon as={AiOutlineLink} fontSize="md" />
                                </Text>
                              )}
                            </>
                          );
                        if (step.status === 'faild') return t('steps.error');
                        return t('steps.waitingForConfirm');
                      })()}
                    </Text>
                    {step.status === 'faild' && (
                      <Button
                        className="As014"
                        ml={2}
                        size="sm"
                        variant="primary"
                        rounded={'md'}
                        onClick={() => {
                          // debugger
                          step.trigger?.();
                        }}
                      >
                        {t('steps.submitTransactionAgain')}
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Box>
            )}
          </Box>
        );
      })}
    </VStack>
  );
};
