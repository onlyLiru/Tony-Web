import {
  Box,
  BoxProps,
  Button,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { useLocalStorageState } from 'ahooks';
import { useMounted } from '@/hooks/useMounted';
import { FiFilter } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { CloseIcon } from '@chakra-ui/icons';
import { useIsRare } from '@/store';

type CardSizeType = 'small' | 'large';

type ContextProps = {
  isOpen: boolean;
  isSmallCard: boolean;
  toggleFilterLayout: () => void;
  changeCardSize: (size?: CardSizeType) => void;
};

const Context = createContext<ContextProps>({
  isOpen: false,
  isSmallCard: false,
  toggleFilterLayout: () => null,
  changeCardSize: () => null,
});

const Provider = (props: PropsWithChildren) => {
  const isMounted = useMounted();
  const [layout, updateLayout] = useLocalStorageState<
    Pick<ContextProps, 'isOpen' | 'isSmallCard'>
  >('explore-layout', {
    defaultValue: {
      isSmallCard: false,
      isOpen: false,
    },
  });

  const isOpen = useMemo(
    () => isMounted && layout.isOpen,
    [isMounted, layout.isOpen],
  );

  const isSmallCard = useMemo(
    () => isMounted && layout.isSmallCard,
    [isMounted, layout.isSmallCard],
  );

  const toggleFilterLayout = () => {
    updateLayout({ ...layout, isOpen: !layout.isOpen });
  };

  const changeCardSize = (cardSize: CardSizeType = 'large') => {
    updateLayout({ ...layout, isSmallCard: cardSize === 'small' });
  };

  return (
    <Context.Provider
      value={{
        isOpen,
        isSmallCard,
        toggleFilterLayout,
        changeCardSize,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

type FilterContainerProps = {
  wrapperProps?: FlexProps;
  topExtraContent?: React.ReactNode;
  filterContent?: React.ReactNode;
  filterWrapperProps?: BoxProps;
  contentWrapperProps?: BoxProps;
  onModalClose?: () => void;
  children: React.ReactNode;
};

const FilterContainerRoot = ({
  wrapperProps,
  filterWrapperProps,
  contentWrapperProps,
  topExtraContent,
  children,
  filterContent,
  onModalClose,
}: FilterContainerProps) => {
  const { isOpen: layoutIsOpen } = useContext(Context);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const t = useTranslations('common');
  const { isOpen, onOpen: openModal, onClose } = useDisclosure();
  const [isRare] = useIsRare();

  return (
    <>
      {topExtraContent}
      <Flex
        w="full"
        align={'flex-start'}
        bg={isRare ? 'rgba(10, 10, 37)' : '#fbfcfe'}
        {...wrapperProps}
      >
        {isLargerThan768 ? (
          <Box
            id="layout-container-left"
            display={{
              base: 'none',
              md: layoutIsOpen ? 'flex' : 'none',
            }}
            flexShrink={0}
            w="326px"
            h="calc(100vh - 200px)"
            pos="sticky"
            top="200px"
            overflow={'auto'}
            {...filterWrapperProps}
          >
            {filterContent}
          </Box>
        ) : (
          <>
            <Button
              pos="fixed"
              rounded="10px"
              zIndex={99}
              bottom={'12px'}
              right={'10px'}
              w="120px"
              variant="primary"
              rightIcon={<FiFilter fontSize={16} />}
              onClick={openModal}
            >
              {t('filter.filter')}
            </Button>

            <Modal size="full" isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader
                  display={'flex'}
                  alignItems="center"
                  justifyContent={'space-between'}
                  fontSize={'2xl'}
                  textAlign="center"
                  bg={isRare ? 'rgba(10, 10, 37)' : ''}
                  color={isRare ? '#fff' : ''}
                >
                  <HStack>
                    <Icon as={FiFilter} fontSize={20} />
                    <Text>{t('filter.filter')}</Text>
                  </HStack>
                  <IconButton
                    onClick={onClose}
                    aria-label=""
                    bg="none"
                    icon={<CloseIcon fontSize={14} />}
                  />
                </ModalHeader>

                <ModalBody
                  borderTopWidth={1}
                  borderColor="primary.gray"
                  py={5}
                  maxH="100vh"
                  overflowY={'auto'}
                  id="layout-container-left"
                  bg={isRare ? 'rgba(10, 10, 37)' : ''}
                >
                  {filterContent}
                </ModalBody>
                <ModalFooter bg="white" pos="sticky" bottom="0">
                  <Button
                    w="full"
                    onClick={() => {
                      onModalClose?.();
                      onClose();
                    }}
                    mr={5}
                    rounded={'lg'}
                  >
                    Reset
                  </Button>
                  <Button
                    w="full"
                    onClick={onClose}
                    type="submit"
                    variant="primary"
                    rounded={'lg'}
                  >
                    Apply
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}

        <Box w="full" pb={5} {...contentWrapperProps}>
          {children}
        </Box>
      </Flex>
    </>
  );
};

export const FilterContainer = Object.assign(FilterContainerRoot, {
  Provider,
  Context,
});
