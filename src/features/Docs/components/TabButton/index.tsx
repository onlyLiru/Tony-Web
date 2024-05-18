import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Link,
  IconButtonProps,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MdOutlineArticle } from 'react-icons/md';

export default function TabButton(props: Omit<IconButtonProps, 'aria-label'>) {
  const t = useTranslations('docs');
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { asPath } = useRouter();
  const activeTab = asPath.split('/')[2];
  const tabs = [
    {
      name: t('insights'),
      key: 'blog',
      link: '/docs/blog/daily/0',
    },
    {
      name: t('event'),
      key: 'event',
      link: `/docs/event/0`,
    },
  ];

  return (
    <>
      <Popover
        trigger={'click'}
        placement={'bottom-end'}
        isOpen={isOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <IconButton
            onClick={onToggle}
            bg="none"
            aria-label=""
            fontSize={28}
            {...props}
            _hover={{ opacity: 0.6 }}
            icon={<MdOutlineArticle />}
          />
        </PopoverTrigger>
        <PopoverContent
          border={0}
          boxShadow={'xl'}
          p={4}
          rounded={'xl'}
          w="auto"
        >
          {tabs?.map((item) => (
            <NextLink href={item.link} key={item.key} passHref>
              <Link
                w="140px"
                role={'group'}
                display={'flex'}
                fontWeight={500}
                rounded="full"
                py={2}
                px={5}
                onClick={onClose}
                transition={'all .3s ease'}
                color={item.key === activeTab ? 'primary.main' : 'typo.sec'}
                _hover={{
                  bg: 'gray.50',
                }}
              >
                {item.name}
              </Link>
            </NextLink>
          ))}
        </PopoverContent>
      </Popover>
    </>
  );
}
