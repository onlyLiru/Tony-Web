import { Wrap, WrapItem, Text, Avatar } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';

const Summary = () => {
  const t = useTranslations('teamz');

  return (
    <div className="flex flex-row flex-wrap justify-between py-6">
      <div className="lg:basis-3/5 sm:basis-full">
        <Wrap className="mb-5 md:mb-0">
          <WrapItem className="cursor-pointer">
            <Avatar
              h="22px"
              w="40px"
              mr="10px"
              borderRadius="none"
              src="/images/teamz/teamz_icon.png"
              onClick={() => window.open('https://en.web3.teamz.co.jp/')}
            />
          </WrapItem>
          <WrapItem className="cursor-pointer">
            <Avatar
              h="24px"
              w="27px"
              borderRadius="none"
              mr="10px"
              src="/images/teamz/twitter.png"
              onClick={() =>
                window.open(
                  'https://twitter.com/teamz_inc?s=21&t=RAAu9fJNBmztC_JghOHBww',
                )
              }
            />
          </WrapItem>
          <WrapItem className="cursor-pointer">
            <Avatar
              h="28px"
              w="27px"
              borderRadius="none"
              mr="10px"
              src="/images/teamz/unemeta.png"
              onClick={() => window.open('https://unemeta.com')}
            />
          </WrapItem>
        </Wrap>
        <Text
          fontSize={{ base: '4.5vw', lg: '36px' }}
          color="white"
          fontFamily="Helvetica-Bold, Helvetica"
          fontWeight="bold"
        >
          TEAMZ
          <Text as="span"> WEB3/AI </Text>
          SUMMIT
          <Text as="span" color="white">
            {' '}
            IN JAPAN{' '}
          </Text>
        </Text>
        <Text
          fontSize={{ base: '4.5vw', lg: '36px' }}
          color="white"
          fontFamily="Helvetica-Bold, Helvetica"
          fontWeight="bold"
        >
          NFT TICKET
        </Text>
      </div>
      <div className="relative lg:basis-2/5 sm:basis-full mt-9 pl-8 max-sm:pl-0 before:content-[''] before:w-[1px] max-lg:before:w-full before:absolute before:left-[-2rem] before:bg-white before:top-2 max-lg:before:top-[-1.5rem] before:h-24 max-lg:before:h-[1px]">
        <Text
          fontFamily="Helvetica-Bold, Helvetica"
          fontSize={{ base: '4vw', lg: '2xl' }}
          color="white"
        >
          April 13th ~ 14th
        </Text>
        <Text
          fontFamily="Helvetica-Bold, Helvetica"
          fontSize={{ base: '12px', lg: '12px' }}
          color="white"
        >
          Toranomon Hills, Tokyo, Japan
        </Text>
        <Text
          fontFamily="Helvetica-Bold, Helvetica"
          fontSize={{ base: '4vw', lg: '2xl' }}
          color="white"
        >
          12.19 11:59(GMT+9)
        </Text>
        <Text
          fontFamily="Helvetica-Bold, Helvetica"
          fontSize={{ base: '12px', lg: '12px' }}
          color="white"
        >
          MINT FROM
        </Text>
      </div>
    </div>
  );
};

export default Summary;
