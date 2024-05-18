import React, { useImperativeHandle, forwardRef } from 'react';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  VStack,
  List,
  ListItem,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

export const RuleModal = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('fmex');

  useImperativeHandle(ref, () => ({
    open: onOpen,
  }));

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent rounded="xl" maxWidth={{ base: '335px', md: '560px' }}>
          <ModalCloseButton />
          <ModalBody
            p="40px 24px"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '18px', md: '22px' }}
          >
            <List spacing={{ base: '10px', md: '20px' }}>
              {[...t.raw('rules')].map((v, i) => (
                <ListItem key={i}>{v}</ListItem>
              ))}
            </List>
            <VStack spacing={1} align="flex-start">
              {[...t.raw('distributionDetails')].map((v, i) => (
                <Text key={i}>{v}</Text>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
