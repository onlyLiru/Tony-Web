import React from 'react';
import { Image } from '@chakra-ui/react';

function IPEcosystem() {
  return (
    <div className="md:h-[840px]  bg-black box-border flex justify-center items-center md:py-0 py-16">
      <div className="text-white text-center md:w-auto w-11/12">
        <h3 className="font-bold md:text-6xl text-4xl mb-[2rem] text-[#E49F5C]">
          Une IP Ecosystem
        </h3>
        <p className="mb-12 md:text-lg">
          UneMeta empowers IP with web3 <br />
          by leveraging AI and fostering innovation
        </p>
        <ul className="list-none flex flex-wrap gap-6 justify-between items-center text-left">
          <li className="overflow-hidden">
            <div className="rounded-[15px] overflow-hidden">
              <a
                href="https://kuma.unemeta.com"
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  className="hover:scale-105 duration-300"
                  {...{
                    w: { base: '100%', md: '580px' },
                    h: { base: 'auto', md: '326px' },
                  }}
                  src={'/images/home/new/20240324-103322.min.png'}
                />
              </a>
            </div>
            <ul className="list-none flex flex-wrap gap-3 my-4">
              <li className="py-1 px-6 rounded-3xl bg-[#E49F5C]">
                Web3 Asset launch
              </li>
              <li className="py-1 px-6 rounded-3xl border-[1px] border-[#CECECE]">
                UneMeta{' '}
                <Image
                  className="inline-block w-3 mx-2"
                  src={'/images/home/new/x.png'}
                />{' '}
                Kumamon
              </li>
            </ul>
            <p>Finding your favorite IP’s products within Web3</p>
          </li>
          <li className="overflow-hidden">
            <div className="rounded-[15px] overflow-hidden">
              <a href="//ai.unemeta.com" target="_blank" rel="noreferrer">
                <Image
                  className="hover:scale-105 duration-300"
                  {...{
                    w: { base: '100%', md: '580px' },
                    h: { base: 'auto', md: '326px' },
                  }}
                  src={'/images/home/new/20240324-103331.min.png'}
                />
              </a>
            </div>
            <ul className="list-none flex flex-wrap gap-3 my-4">
              <li className="py-1 px-6 rounded-3xl bg-[#E49F5C]">AI</li>
              <li className="py-1 px-6 rounded-3xl border-[1px] border-[#CECECE]">
                Une Field
              </li>
            </ul>
            <p>Revolutionizing IP with AI in the Web3 Landscapes</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default IPEcosystem;
