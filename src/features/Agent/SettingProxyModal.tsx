import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react';
import {
  forwardRef,
  useImperativeHandle,
  useContext,
  useState,
  useEffect,
} from 'react';
import { AgentContext } from './Context';
import { useDebounce, useRequest } from 'ahooks';
import { getLevelList, ApiAgent, settingLevel } from '@/services/agent';

export type SettingProxyModalRef = {
  open: (p?: { address?: string; level?: number }) => void;
};

export const SettingProxyModal = forwardRef<SettingProxyModalRef, any>(
  ({ refresh }, ref) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data } = useContext(AgentContext);
    const [address, setAddress] = useState('');
    const [level, setLevel] = useState(0);
    const debouncedValue = useDebounce(address, { wait: 500 });
    const t = useTranslations('promoter');

    const [readOnly, setReadOnly] = useState(false);

    const [defaultValues, setDefaultValues] = useState<any>();

    const [levelOption, setLevelOption] = useState<
      ApiAgent.LevelItem[] | undefined
    >();

    const levelReq = useRequest(getLevelList, {
      manual: true,
    });

    const setLevelReq = useRequest(settingLevel, {
      manual: true,
    });

    useImperativeHandle(ref, () => ({
      open: (p) => {
        if (p) {
          setDefaultValues(p);
          setAddress(p.address!);
          setReadOnly(true);
        } else {
          setReadOnly(false);
        }
        onOpen();
      },
    }));

    useEffect(() => {
      const fetch = async () => {
        try {
          const { data } = await levelReq.runAsync();
          setLevelOption(data.level_list || []);
          if (Array.isArray(data.level_list) && data.level_list.length) {
            setLevel(
              defaultValues ? defaultValues.level : data.level_list[0]?.level,
            );
          }
        } catch (error) {
          toast({ status: 'error', title: error.message, variant: 'subtle' });
        }
      };
      if (isOpen) {
        fetch();
      }
    }, [isOpen]);

    const handleClose = () => {
      onClose();
      setAddress('');
      setLevel(0);
      setDefaultValues(null);
      setLevelOption([]);
    };

    const onConfirm = async () => {
      // console.log(
      //   '🚀 ~ file: InviteSignModal.tsx:84 ~ onSubmit={ ~ values:',
      //   values,
      // );
      try {
        await setLevelReq.runAsync({
          friend_wallet: address,
          level,
        });
        toast({
          status: 'success',
          title: 'success',
          variant: 'subtle',
        });
        refresh();
        handleClose();
      } catch (error) {
        toast({
          status: 'error',
          title: error.message,
          variant: 'subtle',
        });
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={handleClose} isCentered size="xl">
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent maxW={['345px', '720px']}>
          <ModalCloseButton />
          <ModalBody
            mx="auto"
            p={['30px 20px 40px', '50px 38px']}
            color="#000"
            w="full"
            fontFamily="Inter"
          >
            <Box
              fontWeight={700}
              fontSize={['14px', '20px']}
              lineHeight={['16px', '24px']}
              mb={['10px', '20px']}
            >
              {t('addPromoter')}！
            </Box>
            <Box
              fontWeight={700}
              fontSize={['14px', '20px']}
              lineHeight={['16px', '24px']}
              mb={['10px', '20px']}
            >
              {t('userRebateDesc')}
              {data.agent_info.ratio}%
            </Box>
            <Box
              fontWeight={700}
              fontSize={['14px', '20px']}
              lineHeight={['16px', '24px']}
              mb={['10px', '20px']}
            >
              {t('setTransaction')}：
            </Box>
            <VStack align="flex-start" spacing="20px">
              <Input
                isDisabled={readOnly}
                border="none"
                rounded="none"
                borderBottom="1px solid #000"
                _placeholder={{
                  color: '#000',
                }}
                size="lg"
                fontSize="md"
                placeholder="Wallet Address"
                value={address}
                onChange={(e: any) => {
                  setAddress(e.target.value);
                }}
              />

              <Select
                border="none"
                rounded="none"
                borderBottom="1px solid #000"
                _placeholder={{
                  color: '#000',
                }}
                size="lg"
                fontSize="md"
                placeholder="level"
                value={level}
                onChange={(v) => {
                  setLevel(Number(v.target.value));
                }}
              >
                {(levelOption || []).map((v: ApiAgent.LevelItem) => (
                  <option value={v.level} key={v.level}>
                    {v.name}
                  </option>
                ))}
              </Select>
            </VStack>
            <Button
              disabled={!level || !address}
              fontSize={{ base: '14px', md: '16px' }}
              isLoading={setLevelReq.loading}
              w={{ base: 'full', md: '320px' }}
              variant="primary"
              rounded="full"
              size={['md', 'xl']}
              mt="50px"
              onClick={onConfirm}
            >
              {t('confirm')}
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  },
);
