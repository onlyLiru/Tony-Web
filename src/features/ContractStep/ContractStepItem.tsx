import React, { useMemo } from 'react';
import { Flex, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { StepNum, StepNumProps } from './StepNum';
import { useTranslations } from 'next-intl';

type ContractStepItemProps = StepNumProps & {
  title?: React.ReactNode;
  desc?: React.ReactNode;
  trigger: () => void;
};

export const ContractStepItem = (props: ContractStepItemProps) => {
  const t = useTranslations('common');
  const buttonText = useMemo(() => {
    if (props.status === 'success') return `${t('success')}!`;
    if (props.status === 'pending') return t('steps.waitingForConfirm');
    return t('steps.submitTransactionAgain');
  }, [props.status]);
  return (
    <Flex align={'flex-start'} w="full">
      <StepNum status={props.status} step={props.step} />
      <VStack ml={5} align={'flex-start'} spacing={4} flex={'1'}>
        {props.title && <Heading size="md">{props.title}</Heading>}
        {props.desc && <Text>{props.desc}</Text>}

        <Button
          // FIXME
          // 当前组件需要优化 后续调整不要忘记className(gtm跟踪标识)
          className="As011"
          size="lg"
          variant="primary"
          disabled={!!props.status}
          rounded={'lg'}
          mr={3}
          onClick={() => !props.status && props.trigger?.()}
        >
          {buttonText}
        </Button>
      </VStack>
    </Flex>
  );
};
