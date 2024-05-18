import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  Flex,
  Box,
  UnorderedList,
  ListItem,
  ModalFooter,
  Button,
  Center,
  Icon,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle } from 'react';
import { CgArrowsExchange } from 'react-icons/cg';
import { useTranslations } from 'next-intl';
import { useSwitchChain } from '@/hooks/useSwitchChain';

export type WethLearnMoreModalAction = {
  open: () => void;
};

export const WethLearnMoreModal = forwardRef<WethLearnMoreModalAction>(
  (_, ref) => {
    const t = useTranslations('common');
    const { VisitChainLogo, visitChainSymbols } = useSwitchChain();
    const { isOpen, onOpen, onClose } = useDisclosure();
    useImperativeHandle(ref, () => ({
      open: () => {
        onOpen();
      },
    }));

    return (
      <Modal
        size={{ base: 'full', md: 'lg' }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay backdropFilter="blur(12px)" />
        <ModalContent rounded="2xl">
          <ModalCloseButton />
          <ModalBody p={5}>
            <Center>
              <VisitChainLogo.Local fontSize={'120px'} />
              <Icon fontSize={36} as={CgArrowsExchange} />
              <VisitChainLogo.Wrapper fontSize={'120px'} />
            </Center>

            <Text my={5}>
              {t('listingWarning', {
                eth: visitChainSymbols.Local,
                weth: visitChainSymbols.Wrapper,
              })}
            </Text>

            <Box
              color="primary.main"
              bg="blackAlpha.50"
              rounded="xl"
              p={5}
              fontSize={'sm'}
            >
              <Flex mb={3} align={'center'}>
                <QuestionOutlineIcon mr={1} />
                <Text as="strong">
                  {t('whatIsWeth', {
                    weth: visitChainSymbols.Wrapper,
                  })}
                </Text>
              </Flex>
              <Text mb={2} color="typo.sec">
                {t('whatIsWethDesc', {
                  eth: visitChainSymbols.Local,
                  weth: visitChainSymbols.Wrapper,
                })}
              </Text>
              <Text mb={2} fontWeight="bold">
                {t('whatUseWeth', {
                  weth: visitChainSymbols.Wrapper,
                })}
              </Text>
              <UnorderedList pl={3} spacing={2} color="typo.sec">
                <ListItem>{t('whatUseWethDesc1')}</ListItem>
                <ListItem>{t('whatUseWethDesc2')}</ListItem>
                <ListItem>{t('whatUseWethDesc3')}</ListItem>
              </UnorderedList>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              w="full"
              variant="primary"
              rounded="lg"
              size="lg"
              onClick={onClose}
            >
              {t('confirm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  },
);
