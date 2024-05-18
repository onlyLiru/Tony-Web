import React from 'react';
import { useToast } from '@chakra-ui/react';

function useToastCom() {
  const toast = useToast();
  const handleClick = () => {
    toast({
      title: '公主莫慌',
      description: '稍等片刻，comming soon.',
      status: 'info',
      duration: 6000,
      //   isClosable: true,
      position: 'bottom-left',
    });
  };

  return { handleClick };
}

export default useToastCom;
