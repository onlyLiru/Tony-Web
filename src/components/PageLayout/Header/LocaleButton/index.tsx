import { NEXT_LOCALE_KEY } from '@/const/cookie';
import {
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Link,
  IconButtonProps,
  createIcon,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { setCookie } from 'cookies-next';
import { useTranslations } from 'next-intl';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ShimmerImage } from '@/components/Image';
import IconView from '@/components/iconView';
import classNames from 'classnames';

export const LocaleIcon = createIcon({
  displayName: 'Nav Locale Icon',
  viewBox: '0 0 30 30',
  path: [
    <path
      key="p1"
      d="M15 2C7.82098 2 2 7.82098 2 15C2 22.179 7.82098 28 15 28C22.179 28 28 22.179 28 15C28 7.82098 22.179 2 15 2ZM15 8.5C14.144 8.5 13.3083 8.42455 12.4987 8.28237C13.2589 5.22969 14.4022 3.625 15 3.625C15.5978 3.625 16.7411 5.22969 17.5013 8.28237C16.6917 8.42165 15.856 8.5 15 8.5ZM19.0828 7.90804C18.6882 6.29174 18.16 4.9308 17.542 3.92098C19.3875 4.34464 21.0618 5.21808 22.446 6.41942C21.4216 7.05201 20.29 7.55402 19.0828 7.90804ZM10.9172 7.90804C9.71004 7.55402 8.58125 7.04911 7.55692 6.41942C8.94107 5.21808 10.6125 4.34754 12.458 3.92388C11.84 4.9308 11.3147 6.29174 10.9172 7.90804ZM19.8605 14.1875C19.8228 12.519 19.6661 10.9404 19.4136 9.50402C20.9371 9.06875 22.3531 8.42165 23.6154 7.59464C25.165 9.39375 26.1545 11.6775 26.3344 14.1875H19.8605ZM3.66562 14.1875C3.84554 11.6804 4.83214 9.39665 6.37879 7.59754C7.64107 8.42455 9.06004 9.06585 10.5864 9.50112C10.3339 10.9404 10.1772 12.519 10.1395 14.1875H3.66562ZM11.7645 14.1875C11.8022 12.5712 11.9502 11.129 12.1679 9.87254C13.0848 10.035 14.0279 10.125 15 10.125C15.9692 10.125 16.9152 10.0379 17.8321 9.87545C18.0498 11.1319 18.1949 12.5741 18.2355 14.1875H11.7645ZM23.6154 22.4054C22.3531 21.5783 20.9371 20.9312 19.4136 20.496C19.6661 19.0567 19.8228 17.4781 19.8605 15.8125H26.3344C26.1545 18.3225 25.165 20.6063 23.6154 22.4054ZM12.1679 20.1275C11.9502 18.871 11.8051 17.4288 11.7645 15.8125H18.2326C18.1949 17.4259 18.0498 18.8681 17.8292 20.1246C16.9152 19.9621 15.9692 19.875 15 19.875C14.0308 19.875 13.0848 19.965 12.1679 20.1275ZM6.3817 22.4025C4.83504 20.6033 3.84554 18.3196 3.66853 15.8125H10.1424C10.1801 17.481 10.3368 19.0596 10.5893 20.4989C9.06295 20.9342 7.64397 21.5754 6.3817 22.4025ZM15 26.375C14.4022 26.375 13.2589 24.7703 12.4987 21.7176C13.3083 21.5783 14.144 21.5 15 21.5C15.856 21.5 16.6917 21.5783 17.5013 21.7176C16.7411 24.7703 15.5978 26.375 15 26.375ZM17.542 26.079C18.16 25.0692 18.6882 23.7083 19.0828 22.092C20.2929 22.446 21.4216 22.948 22.446 23.5777C21.0618 24.7819 19.3875 25.6554 17.542 26.079ZM12.458 26.079C10.6125 25.6554 8.94107 24.7848 7.55692 23.5835C8.57835 22.9509 9.70714 22.4489 10.9172 22.0949C11.3147 23.7083 11.84 25.0692 12.458 26.079Z"
      fill="currentColor"
    />,
  ],
});

export default function LocaleButton(
  props: Omit<IconButtonProps, 'aria-label'>,
) {
  const t = useTranslations('common');
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { locale, locales, asPath } = useRouter();

  const onSwitch = (current: string) => {
    setCookie(NEXT_LOCALE_KEY, current);
    onClose();
  };
  return (
    <Box border="1px solid rgba(255,255,255,0.1)" borderRadius="12px">
      <Popover
        trigger={'click'}
        placement={'bottom-start'}
        isOpen={isOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <div
            className="rounded-[4px] text-[16px] cursor-pointer select-none"
            onClick={onToggle}
          >
            {/* <ShimmerImage
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA11JREFUaEPtWC1zFEEUfG3AgAIDBhQYUCgwoMCAAQwoVH4UCgxRwQQTMMEkKgoMMQRDDMEkJjEP+mpmq292925md6+OK3aqUqnbnZ3tfq/f18JWfGHF8dtIYNkeHD0weqCnBUYJ9TRg78dHD6gJ3f2qmV03sytmdsHMzof7p2b228yOzOwAwM/epg8HDOIBd79hZnfM7GImsGMz2wOwn7m/dVsvAu5OwA/N7FJHICTyAQD/d1qdCQSr3xWZEMCZmZ0TJHvh9225lu7h720AB10YdCLg7tQ5LR8XQXwxM2r9Xrh4AuCdu5PQ8xATvLUbSFFyuj4D+FZKophAkM1TsfzJX/1vUgbu/iQEMHFUgNz9lhA7BLAZzuF+Bnv03kapnLoQeCHBquBp6VdiwfUIJnhB770FcNpA4gjARokXiggE3T9oAamymlhZgSTe+Rg1H0g8k9hhPGRnp1ICan2mQQbpZLk7NR11/RXATkKAAR+Deep+8uwxgPVcL2QTCEXqsQZoAvCRmV0L1yoLC0HWiui9HwC25B7l91K8wNSaVexKCKgF9wFsJwQog1gPagDc/bKZMfi5alp391YPzfJGCQHNME0AVV5VAIuVWfS4h6smkyQ1ZwdzCQFmkVikmgCuRbAAXjdZzd1b94RgjgTPALzJiYMSAtXLcw7uu6fNCOm5/xUBlVBfA897fiES0izTlCb7BjFniZima4WwjXGJhGamOXdXgu8B/ErSrAJsSqOsEawVXLVCOAQBBcDuk5mI3edkubsWslo7kKTJqUIWnlcPDl/IwktYLWP3mLYS8zyk92e1IZM2fF6QVCk7d2MgcNPM7odn6IWq/U0sXNrMxfzPo4vmguwYEKmo1quRsK1lDsS1CvOSttMM3DhLF1mfB3UhwJdp+6sktN3YBcApjfGhjZwONAp+yqO5yigm0CCl+C621jpSVv2Ou2uAxpGSU1r87MIzPgH4ngu8UwwkaZEDDFOfDvEkoKDoAVpW5990D+/vlAwxiqOTByQeKCeda0sNyI9dW6Vz8GAEhAizE60cU+w8IpylmUqLv0KkB/fyQHqYfFrkYMO/KC/KhMF++E9+Wpxn7kXeH9QDiwTadvZIYBlWHzwLLZPEKKFlWr9TM7dswAstZMsgt/Ix8Ade9ZVA25/NDgAAAABJRU5ErkJggg=="
              w="20px"
              h="20px"
            /> */}
            <IconView className="w-[40px] h-auto" type="i18Language" />
          </div>
          {/* <IconButton
            className="Tn009 !w-[40px]"
            width="140px"
            onClick={onToggle}
            bg="none"
            aria-label=""
            fontSize={16}
            {...props}
            _hover={{ opacity: 0.6 }}
            icon={}
          /> */}
        </PopoverTrigger>
        <PopoverContent
          w="auto"
          overflow={'hidden'}
          className="p-[8px] !bg-[#0A0A0A] !border-[1px] !border-[#fff]/10 rounded-[10px] !outline-none !shadow-none"
        >
          {locales?.map((item) => (
            <NextLink href={asPath} locale={item} key={item} passHref>
              <Link
                className={classNames(
                  item === 'ja' ? 'Tn010' : item === 'en' ? 'Tn011' : 'Tn012',
                  'rounded-[10px] flex justify-start items-center px-[8px] bg-transparent! mb-[4px]',
                )}
                onClick={() => onSwitch(item)}
                color={item === locale ? 'primary.main' : 'typo.sec'}
                role={'group'}
                h="45px"
                transition={'all .3s ease'}
                // _hover={{
                //   bg: 'rgba(217, 217, 217, 0.5)',
                // }}
              >
                <span className="text-[#fff] text-[14px] font-[600]">
                  {t(`header.locale.${item}` as any)}
                </span>
              </Link>
            </NextLink>
          ))}
        </PopoverContent>
      </Popover>
    </Box>
  );
}
