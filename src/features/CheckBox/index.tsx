import React, { ReactNode } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Center, Flex } from '@chakra-ui/react';

type Props = {
  checked?: boolean;
  onChange: (v: boolean) => void;
  children?: ReactNode;
};

const CheckBox = ({ checked = false, onChange, children }: Props) => {
  return (
    <Flex
      onClick={(e) => {
        e.preventDefault();
        onChange(!checked);
      }}
      cursor={'pointer'}
      direction={{ md: 'row', base: 'row-reverse' }}
      align={'center'}
    >
      <Center
        bg={'#FFFFFF'}
        w={{ md: '32px', base: '16px' }}
        h={{ md: '32px', base: '16px' }}
        borderRadius={{ md: '4px', base: '2px' }}
        border={
          checked ? '2px solid #14141F;' : '2px solid rgba(20, 20, 31, 0.5)'
        }
      >
        {checked && <FaCheck className="sm: text-xs md:text-lg" />}
      </Center>
      {children}
    </Flex>
  );
};

export default CheckBox;
