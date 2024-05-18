import React from 'react';
import { Image } from '@chakra-ui/react';

const items = [
  {
    href: 'https://twitter.com/hanazawa_staff/status/1532965353097416704?s=20',
    img: '/images/home/new/20240321-111507.min.png',
    size: {
      width: {
        base: '90%',
        md: '241px',
      },
      height: {
        base: 'auto',
        md: '22px',
      },
    },
  },
  {
    href: 'https://x.com/belladonna_nft?s=21',
    img: '/images/home/new/20240321-111757.min.png',
    size: {
      w: { base: 'auto', md: '120px' },
      h: { base: '166%', md: '120px' },
    },
  },
  {
    href: 'https://x.com/une_kumamon_nft?s=21',
    img: '/images/home/new/20240321-111901.min.png',
    size: { w: { base: '80%', md: '174px' }, h: { base: 'auto', md: '174px' } },
  },
  {
    href: 'https://www.youtube.com/watch?v=kcJeVo9RjQg',
    img: '/images/home/new/20240321-103941.min.png',
    size: { w: { base: 'auto', md: '64px' }, h: { base: '80%', md: '54px' } },
  },
  {
    href: 'https://x.com/hanazawa_nft?s=21',
    img: '/images/home/new/20240321-103935.min.png',
    size: {
      w: { base: 'auto', md: '124px' },
      h: { base: '170%', md: '124px' },
    },
  },
  {
    href: 'http://www.mushi-pro.co.jp',
    img: '/images/home/new/20240321-103927.min.png',
    size: { w: { base: 'auto', md: '44px' }, h: { base: '80%', md: '54px' } },
  },
];

function Section6() {
  return (
    <div className="md:h-[840px] bg-black box-border border-b-[1px] border-[#9D9D9D] flex justify-center items-center">
      <div className=" w-11/12 text-center md:pb-0 pb-36 md:pt-0 pt-14">
        <h3 className="font-bold md:text-6xl text-4xl mb-[2rem] text-[#E49F5C]">
          We Have Worked With The Top IPs
        </h3>
        <p className="mb-12 md:text-3xl">Leading the Way in Web3 IP</p>
        <div className="flex justify-center">
          <ul className="flex flex-wrap justify-between items-center mt-3 list-none md:w-[1000px]">
            {items.map((item, i) => (
              <li
                key={i}
                className="md:w-[306px] w-[48%] md:h-[80px] h-[4rem] border-[1px] rounded-md border-[#3B3B3B] flex justify-center items-center overflow-hidden my-2"
              >
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className=" h-full w-full flex justify-center items-center overflow-hidden"
                >
                  <Image
                    {...item.size}
                    src={item.img}
                    className="hover:scale-105 duration-300"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-12 text-3xl text-[#E49F5C]">
          Stay Tuned
          <br />
          More to Come
        </p>
      </div>
    </div>
  );
}

export default Section6;
