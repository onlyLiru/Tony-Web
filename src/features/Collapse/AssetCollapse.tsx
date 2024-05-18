import {
  Accordion,
  AccordionButton,
  AccordionButtonProps,
  AccordionItem,
  AccordionPanel,
  ChakraProps,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React from 'react';

export const AssetCollapse: React.FC<{
  title: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  headerProps?: AccordionButtonProps;
  bodyProps?: ChakraProps;
}> = ({ title, disabled, children, headerProps, bodyProps }) => {
  return (
    <Accordion
      borderWidth={2}
      borderColor="primary.gray"
      rounded="xl"
      w="full"
      overflow="hidden"
      allowToggle
      defaultIndex={!disabled ? [0] : undefined}
    >
      <AccordionItem border="none">
        {({ isExpanded }) => (
          <>
            <AccordionButton
              h={{ base: '50px', md: '80px' }}
              bg={isExpanded ? 'gray.50' : 'white'}
              _hover={{ bg: 'gray.50' }}
              {...headerProps}
            >
              <Flex w="full" align="center" justify="space-between">
                <Heading size={{ base: 'sm', md: 'md' }}>{title}</Heading>
                {!disabled && (
                  <ChevronRightIcon
                    fontSize={32}
                    transition="all ease 0.3s"
                    transform={isExpanded ? 'rotate(90deg)' : ''}
                  />
                )}
              </Flex>
            </AccordionButton>
            <AccordionPanel p={{ base: 4, md: 6 }} fontSize="md" {...bodyProps}>
              {children}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};
