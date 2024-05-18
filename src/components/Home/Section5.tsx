import React from 'react';
import { Image, useMediaQuery } from '@chakra-ui/react';
import { useRouter } from 'next/router';

function Section5() {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const router = useRouter();

  return (
    <div className="md:h-[840px] md:bg-[url(/images/home/new/Frame211.min.png)] bg-[url(/images/home/new/Frame209.min.png)] bg-[rgba(0,0,0,0.9)] bg-cover bg-center bg-no-repeat box-border flex justify-center items-center">
      <div className="md:w-[600px] w-11/12 text-center md:py-0 py-20">
        <h3 className="font-bold text-3xl mb-[2rem] text-[#E49F5C]">
          IP Web3 Asset Launchpad
        </h3>
        <Image
          w={{ base: '100%', md: '600px' }}
          h={{ base: 'auto', md: '207px' }}
          src={
            isLargerThan768
              ? '/images/home/new/20240321-104014.min.png'
              : '/images/home/new/20240321-132023.min.png'
          }
          cursor="pointer"
          onClick={() => {
            location.href =
              'https://unemeta.wordpress.com/2023/06/17/japans-national-ip-kumamon-reached-an-official-cooperation-with-unemeta/';
          }}
        />
        <div className="flex flex-wrap justify-between mt-3">
          <Image
            w={{ base: '48%', md: '141px' }}
            h={{ base: 'auto', md: '141px' }}
            mb={{ base: '1rem', md: '0' }}
            src="/images/home/new/20240321-104009.min.png"
            cursor="pointer"
            onClick={() => {
              router.push('/projects/belladonna');
            }}
          />
          <Image
            w={{ base: '48%', md: '141px' }}
            h={{ base: 'auto', md: '141px' }}
            mb={{ base: '1rem', md: '0' }}
            src="/images/home/new/20240321-104003.min.png"
            cursor="pointer"
            onClick={() => {
              router.push('/projects/hanazawa');
            }}
          />
          <Image
            w={{ base: '48%', md: '141px' }}
            src="/images/home/new/20240321-103958.min.png"
            cursor="pointer"
            onClick={() => {
              router.push('/teamz');
            }}
          />
          <Image
            w={{ base: '48%', md: '141px' }}
            h={{ base: 'auto', md: '141px' }}
            src="/images/home/new/20240321-103952.min.png"
            cursor="pointer"
            onClick={() => {
              router.push('/projects/yuliverse');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Section5;
