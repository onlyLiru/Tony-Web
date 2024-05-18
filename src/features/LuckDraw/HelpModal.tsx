import {
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  Box,
  Text,
  ModalCloseButton,
} from '@chakra-ui/react';
import { DBox } from './LuckDrawUi1';
import { useTranslations } from 'next-intl';
import { forwardRef, useImperativeHandle } from 'react';

export type HelpModalRef = {
  open: () => void;
};

export const HelpModal = forwardRef((_, ref) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const t = useTranslations('points');

  useImperativeHandle(ref, () => ({
    open: () => {
      onOpen();
    },
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      isCentered
    >
      <ModalOverlay bg="blackAlpha.700" />
      <ModalContent mx={{ md: 'auto', base: '4vw' }}>
        <DBox
          contentProps={{
            w: 'full',
          }}
        >
          <Box
            color={'#001E46'}
            fontSize={'14px'}
            fontWeight={'500'}
            pos={'relative'}
            zIndex={2}
            lineHeight={'14px'}
          >
            {t.raw('uuuDoc')?.map((item: any, i: number) => (
              <Box key={i}>
                <Text mb={'10px'}>
                  {`${i + 1}.`}
                  {item.title}：
                </Text>
                <Text
                  mb={'25px'}
                  key={i}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                ></Text>
              </Box>
            ))}
          </Box>
        </DBox>
        <ModalCloseButton
          color={'#B5B5B5'}
          top={{ md: '0', base: '-2px' }}
          right={{ md: '0', base: '0' }}
          zIndex={100}
        />
      </ModalContent>
    </Modal>
  );
});
