import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  Text,
  Button,
  Flex,
  VStack,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { useTranslations } from 'next-intl';
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  memo,
  useRef,
  useMemo,
} from 'react';

export type ResultModalRef = {
  open: (type: number) => number;
};

const prizeImgs: Record<string, string> = {
  '100': 'c1',
  '101': 'c2',
  '102': 'c3',
  '103': 'c4',
  '104': 'c2',
  '105': 'c4',
  '106': 'c3',
  '107': 'c4',
};

export const ResultModal = memo(
  forwardRef((props: { openTurntable?: () => void }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const t = useTranslations('points');
    const ct = useTranslations('common');
    const [rType, setRType] = useState(100);
    const audioRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      open: (type: number) => {
        onOpen();
        setRType(type);
        setTimeout(() => {
          audioRef.current.play();
        }, 100);
      },
    }));

    return (
      <>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
          isCentered
        >
          <ModalOverlay bg="blackAlpha.700" />
          <ModalContent
            bg={'transparent'}
            w={'244px'}
            transition={'all .5s'}
            transform={isOpen ? 'scale(1)' : 'scale(0)'}
            boxShadow={'none'}
          >
            <VStack>
              <Flex
                w={'300px'}
                h={'248.36px'}
                bgImage={'/images/points/gift.png'}
                bgSize={'300px 248.36px'}
                pos={'relative'}
                justify={'center'}
                pt={'70px'}
                mb={'-15px'}
              >
                <Flex
                  flexDirection={'column'}
                  align={'center'}
                  transform={'rotate(-10deg);'}
                  position={'relative'}
                  left={'-5px'}
                >
                  <Image
                    src={`/images/points/${prizeImgs[String(rType)]}.png`}
                    w={'37px'}
                  />
                  <Text fontWeight={'600'} color={'#000000'} fontSize={'10px'}>
                    {t(`gifts.${rType}` as any)}
                  </Text>
                </Flex>
              </Flex>
              <Button
                bg={'#FAC736'}
                rounded={'100px'}
                boxShadow={'2px 4px 0px #AB7F00;'}
                w={'174px'}
                h={'40px'}
                _hover={{ bg: '#FAC736', opacity: 0.99 }}
                color={'#000000'}
                fontWeight={'600'}
                onClick={onClose}
              >
                {ct('confirm')}
              </Button>
            </VStack>
          </ModalContent>
        </Modal>
        {useMemo(
          () => (
            <audio
              style={{ opacity: 0 }}
              ref={audioRef}
              src={'/sounds/win.mp3'}
            ></audio>
          ),
          [],
        )}
      </>
    );
  }),
);
