import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  VStack,
  useDisclosure,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { invalidateCode } from '@/services/agent';

type OpenParams = { code: string };
export type InvalidateLinkRef = {
  open: (p: OpenParams) => void;
};

export const InvalidateLinkModal = forwardRef<InvalidateLinkRef, any>(
  ({ refresh }, ref) => {
    const [state, setState] = useState<OpenParams>({ code: '' });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useImperativeHandle(ref, () => ({
      open: (p: OpenParams) => {
        setState(p);
        onOpen();
      },
    }));

    const onConfirm = async () => {
      try {
        await invalidateCode(state);
        toast({
          status: 'success',
          title: `success`,
          variant: 'subtle',
        });
        onClose();
        refresh();
      } catch (error) {
        toast({ status: 'error', title: error.message, variant: 'subtle' });
      }
    };
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent maxWidth={{ base: '345px', md: '880px' }}>
          <ModalBody
            p={{ md: '147px 0 40px', base: '40px 0' }}
            color="#000"
            w="full"
            bgSize="cover"
            fontWeight={500}
            fontSize={{ md: '24px', base: '16px' }}
            lineHeight={{ md: '30px', base: '18px' }}
          >
            <VStack
              spacing={{ md: '20px', base: '36px' }}
              px={{ md: '140px', base: '22px' }}
              mb={{ md: '120px', base: '58px' }}
            >
              <Box fontWeight={700}>Invalidate the link?</Box>
              <Box
                fontSize={{ md: '20px', base: '14px' }}
                lineHeight={{ md: '24px', base: '16px' }}
                textAlign={{ md: 'center', base: 'left' }}
                color={{ md: '#000', base: '#6A6A6A' }}
              >
                Invalid links will not be able to invite new users and cannot be
                restored, but historical data and rebate remains.
              </Box>
            </VStack>
            <HStack px={{ md: '82px', base: '22px' }} justify="space-between">
              <Button
                w={{ md: '318px', base: '140px' }}
                h={{ md: '76px', base: '40px' }}
                fontSize={{ md: '20px', base: '14px' }}
                bgColor="#fff"
                rounded="100px"
                variant="outline"
                onClick={onClose}
              >
                No,thanks
              </Button>
              <Button
                w={{ md: '318px', base: '140px' }}
                h={{ md: '76px', base: '40px' }}
                fontSize={{ md: '20px', base: '14px' }}
                bgColor="#14141F"
                rounded="100px"
                color="#fff"
                _hover={{ opacity: 0.8 }}
                onClick={onConfirm}
              >
                Yes
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  },
);
