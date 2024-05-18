import { CheckCircleIcon } from '@chakra-ui/icons';
import { Center, Icon, Spinner } from '@chakra-ui/react';
import { useMemo } from 'react';
import { FaFileContract } from 'react-icons/fa';

export type StepNumProps = {
  status?: 'pending' | 'success' | '';
  step?: number;
};

export const StepNum = ({ status }: StepNumProps) => {
  const color = useMemo(() => {
    if (status === 'success')
      return { color: 'green.300', emptyColor: 'green.300' };
    if (status === 'pending')
      return { color: 'primary.main', emptyColor: 'gray.200' };
    return { color: 'gray.200', emptyColor: 'gray.200' };
  }, [status]);
  return (
    <Center pos="relative">
      <Center pos="absolute" top="0" right="0" left="0" bottom="0">
        <Icon
          as={status === 'success' ? CheckCircleIcon : FaFileContract}
          fontSize={status === 'success' ? '48px' : 'xl'}
          color={color.color}
        />
      </Center>
      <Spinner
        thickness="3px"
        speed="0.65s"
        emptyColor={color.emptyColor}
        color={color.color}
        size="xl"
      />
    </Center>
  );
};
