import IconView from '@/components/iconView';
import { ApiUser, getNotifyList, readNotify } from '@/services/user';
import { useUserDataValue } from '@/store';
import {
  IconButton,
  createIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Flex,
  Box,
  Center,
  Text,
  BoxProps,
  useToast,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { useRequest } from 'ahooks';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { TrophyIcon } from '../ProfileButton/Icons';

const BellIcon = createIcon({
  displayName: 'Bell Icon',
  viewBox: '0 0 24 24',
  path: [
    <path
      key="d1"
      d="M5 19V9C5 5.134 8.134 2 12 2C15.866 2 19 5.134 19 9V19M2 19H22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />,
    <path
      key="d2"
      d="M12 22C13.3807 22 14.5 20.8807 14.5 19.5V19H9.5V19.5C9.5 20.8807 10.6193 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />,
  ],
});

export default function NotifyBoxButton(props: BoxProps) {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [list, setList] = useState<ApiUser.NotifyListItem[]>([]);
  const userData = useUserDataValue();
  const { loading, run } = useRequest(getNotifyList, {
    manual: true,
    onSuccess: ({ data }) => {
      setList(data.list || []);
    },
  });
  const toast = useToast();
  const t = useTranslations('common');
  const showRedDot = useMemo(() => list.some((el) => !el.read), [list]);

  useEffect(() => {
    if (userData?.wallet_address) {
      run();
    }
  }, [userData?.wallet_address]);

  if (!userData?.wallet_address) return null;
  return (
    <>
      <Popover
        trigger={'click'}
        placement="bottom-end"
        isOpen={isOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Box pos="relative" {...props}>
            {showRedDot && (
              <Box
                pos="absolute"
                top={{ base: '0px', md: '-2px' }}
                right="6px"
                w="8px"
                h="8px"
                rounded="full"
                bg="#DF4949"
              />
            )}
            <div
              className="p-[5px] rounded-[4px] text-[16px] cursor-pointer select-none"
              onClick={async () => {
                if (!isOpen && !list.length) {
                  run();
                }
                onToggle();
              }}
            >
              <IconView
                className="w-[40px] h-auto"
                type="notification"
              ></IconView>
            </div>
          </Box>
        </PopoverTrigger>
        <PopoverContent
          border={0}
          p={0}
          boxShadow={{
            base: '0px 4px 4px rgba(20, 20, 31, 0.15)',
            md: '0px 4px 16px rgba(20, 20, 31, 0.15)',
          }}
          rounded={{ base: '0px', md: '6px' }}
          w={{ base: '100vw', md: '336px' }}
          h="300px"
          bg="white"
          overflow={'hidden'}
        >
          <Flex direction="column" w="full" h="full">
            {loading && (
              <Center h="full" flexGrow={1}>
                <Spinner />
              </Center>
            )}
            {!loading && !list.length && (
              <Center h="full" flexGrow={1}>
                {t('noItems')}
              </Center>
            )}
            <Box flexGrow={1} overflowY="auto">
              {Array.isArray(list) &&
                list.map((item, i) => (
                  <Flex
                    onClick={() => {
                      if (!item.read) {
                        setList((prev) => {
                          const next = JSON.parse(JSON.stringify(prev));
                          next[i].read = true;
                          return next;
                        });
                        try {
                          readNotify({
                            id_list: [item.id],
                          });
                        } catch (error) {}
                      }
                      if (item.link) {
                        const target =
                          item.link.startsWith('https://') ||
                          item.link.startsWith('http://')
                            ? item.link
                            : `https://${item.link}`;
                        window.open(target, '_blank');
                      }
                    }}
                    px="26px"
                    minH="72px"
                    align={'center'}
                    key={i}
                    transition="all .25s ease"
                    cursor="pointer"
                    _hover={{
                      bg: '#E6F7FF',
                    }}
                  >
                    <Center
                      rounded="full"
                      flexShrink={0}
                      w="32px"
                      h="32px"
                      bg="#FFCE3D"
                    >
                      <TrophyIcon color="white" w="24px" h="24px" />
                    </Center>
                    <Box ml="6px" flexGrow={1}>
                      <Text
                        fontSize={'14px'}
                        lineHeight="22px"
                        color={item.read ? '#9E9E9E' : '#000'}
                        mb="5px"
                      >
                        {item.title}
                      </Text>
                      <Text fontSize={'12px'} lineHeight="22xp" color="#9E9E9E">
                        {item.content}
                      </Text>
                    </Box>
                  </Flex>
                ))}
            </Box>
            {list.length > 0 && (
              <Button
                h="48px"
                flexShrink={0}
                fontSize={'14px'}
                rounded="none"
                borderTop={'2px solid'}
                borderColor="#f2f2f2"
                bg="none"
                _hover={{
                  bg: '#f2f2f2',
                }}
                onClick={async () => {
                  if (!showRedDot) return;
                  try {
                    setList((prev) =>
                      prev.map((el) => ({ ...el, read: true })),
                    );
                    await readNotify({
                      id_list: list.filter((el) => !el.read).map((el) => el.id),
                    });
                    toast({ status: 'success', title: '操作成功~' });
                  } catch (error) {
                    toast({ status: 'error', title: error.message });
                  }
                }}
              >
                {t('header.markAsRead')}
              </Button>
            )}
          </Flex>
        </PopoverContent>
      </Popover>
    </>
  );
}
