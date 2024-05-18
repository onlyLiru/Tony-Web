import {
  useDisclosure,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  HStack,
  Center,
  Box,
  Text,
  Link,
  IconButtonProps,
  Icon,
} from '@chakra-ui/react';
import Image from '@/components/Image';
import { BsTwitter, BsShare } from 'react-icons/bs';
import { useTranslations } from 'next-intl';

type ShareButtonProps = {
  onCopy?: () => void;
  onTwitter?: () => void;
} & Omit<IconButtonProps, 'aria-label'>;

export const ShareButton = ({
  onCopy,
  onTwitter,
  ...props
}: ShareButtonProps) => {
  const t = useTranslations('common');
  const { isOpen, onToggle, onClose } = useDisclosure();
  return (
    <Box>
      <Popover
        trigger={'click'}
        placement={'bottom-end'}
        returnFocusOnClose={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <IconButton
            onClick={onToggle}
            aria-label=""
            bg="none"
            _hover={{
              bg: 'blackAlpha.50',
            }}
            {...props}
            icon={
              <Icon fontSize={{ base: '22px', md: '24px' }}>
                <g
                  id="item"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <g
                    id="商城备份-2"
                    transform="translate(-584.000000, -691.000000)"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="2.25"
                  >
                    <g
                      id="编组-30"
                      transform="translate(468.000000, 671.000000)"
                    >
                      <g
                        id="编组-27"
                        transform="translate(96.000000, 0.000000)"
                      >
                        <g
                          id="画板备份-7"
                          transform="translate(20.000000, 20.000000)"
                        >
                          <path
                            d="M21.75,12.75 L21.75,19.5 C21.75,20.7426407 20.4068542,21.75 18.75,21.75 L5.25,21.75 C3.59314575,21.75 2.25,20.7426407 2.25,19.5 L2.25,12.75"
                            id="路径"
                          ></path>
                          <path
                            d="M17.625,4.875 L16.125,4.875 C13.6397186,4.875 11.625,6.88971863 11.625,9.375 L11.625,17.25 L11.625,17.25"
                            id="直线-2备份-2"
                          ></path>
                          <polyline
                            id="直线-2备份-2"
                            transform="translate(17.437500, 4.875000) rotate(-180.000000) translate(-17.437500, -4.875000) "
                            points="19.125 1.5 15.75 4.875 19.125 8.25"
                          ></polyline>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </Icon>
            }
          />
        </PopoverTrigger>
        <PopoverContent
          border={0}
          boxShadow={'md'}
          p={0}
          rounded={'lg'}
          w="auto"
        >
          <Link
            onClick={() => {
              onTwitter?.();
              onClose();
            }}
            transition={'all ease 0.3s'}
            _hover={{
              bg: 'blackAlpha.50',
            }}
            px={2}
            py={3}
            color="primary.main"
          >
            <HStack>
              <Center color="accent.blue" h={'30px'} w={'30px'}>
                <Icon as={BsTwitter} fontSize={'22px'} />
              </Center>
              <Text fontWeight="bold" color="primary.main">
                {t('shareTo')} Twitter
              </Text>
            </HStack>
          </Link>
          <Link
            onClick={() => {
              onCopy?.();
              onClose();
            }}
            transition={'all ease 0.3s'}
            _hover={{
              bg: 'blackAlpha.50',
            }}
            px={2}
            py={3}
            color="primary.main"
          >
            <HStack>
              <Center color="accent.blue" h={'30px'} w={'30px'}>
                <Image
                  objectFit="contain"
                  src="/logo_l.png"
                  w={'26px'}
                  h={'26px'}
                />
              </Center>
              <Text fontWeight="bold">{t('copyLink')}</Text>
            </HStack>
          </Link>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
