import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import * as htmlToImage from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import '@fontsource/outfit/500.css';
import { CloseIcon } from '@chakra-ui/icons';
import { ApiAgent } from '@/services/agent';

const gradientBgs = [
  '#fff url(/images/agent/qrcode_gradient_1.svg) center no-repeat',
  '#fff url(/images/agent/qrcode_gradient_2.svg) center no-repeat',
  '#fff url(/images/agent/qrcode_gradient_3.svg) center no-repeat',
];

const getRandomGradient = () =>
  gradientBgs[Math.floor(Math.random() * gradientBgs.length)]!;

type OpenParams = ApiAgent.JoinmeRes;

export type QrcodeModalRef = {
  open: (p: OpenParams) => void;
};

export const QrcodeModal = forwardRef<QrcodeModalRef>((_, ref) => {
  const toast = useToast();
  const domEl = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<OpenParams>({
    code: '',
  });
  const [bg, setBg] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('promoter');

  useImperativeHandle(ref, () => ({
    open: (p: OpenParams) => {
      setState(p);
      setBg(getRandomGradient());
      onOpen();
    },
  }));

  const downloadImage = async () => {
    setLoading(true);
    try {
      const dataUrl = await htmlToImage.toPng(domEl.current!, {
        pixelRatio: 2,
        quality: 1,
        filter(node) {
          const exclusionClasses = ['qrcode-modal-close'];
          return !exclusionClasses.some((classname) =>
            node.classList?.contains(classname),
          );
        },
      });
      // download image
      const link = document.createElement('a');
      link.download = 'unemeta-qrcode.png';
      link.href = dataUrl;
      link.click();
      toast({ status: 'success', title: 'save success' });
      onClose();
    } catch (error) {}
    setLoading(false);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="rgba(255,255,255,0.6)" backdropFilter="blur(8px)" />
      <ModalContent
        bg="transparent"
        maxW="360px"
        boxShadow={'none'}
        alignItems="center"
      >
        <ModalBody
          ref={domEl}
          p="30px 20px"
          color="#000"
          w="full"
          maxWidth={'360px'}
          bg={bg}
          bgSize="cover"
          fontFamily="Outfit"
          fontWeight={500}
        >
          <CloseIcon
            className="qrcode-modal-close"
            color="white"
            pos="absolute"
            right="16px"
            top="16px"
            onClick={onClose}
          />
          <Flex align="center" mb="20px">
            <Image w="28px" mr="8px" src="/logo_l.png" />
            <Text>UNEMETA</Text>
          </Flex>
          <Box mb="30px" fontSize="14px" fontWeight={500}>
            {t('signupTitle')}
          </Box>
          <Flex
            direction="column"
            mx="auto"
            bg="transparent url(/images/agent/qrcode_bg.svg) center center no-repeat"
            bgSize="cover"
            rounded="10px"
            align="center"
            h="360px"
            w="full"
            pt="50px"
          >
            <QRCodeSVG
              size={220}
              value={`${window.location.origin}/agent/invite?agentInviteCode=${state.code}`}
            />
            <Box
              lineHeight="18px"
              mt="20px"
              mb="0"
              fontWeight={500}
              fontSize="14px"
            >
              {t('inviteId')}
            </Box>
            <Box fontWeight={500} fontSize="28px">
              {state.code}
            </Box>
          </Flex>
        </ModalBody>

        <Button
          w="140px"
          h="38px"
          rounded="full"
          mt="40px"
          variant="primary"
          fontSize={'12px'}
          textTransform="uppercase"
          onClick={downloadImage}
          isLoading={loading}
          loadingText="Downloading"
        >
          Save to album
        </Button>
      </ModalContent>
    </Modal>
  );
});
