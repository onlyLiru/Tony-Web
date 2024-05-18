import React from 'react';
import { Button } from '@chakra-ui/react';
import { linkBlank } from '@/utils/linkBlank';

function Section4() {
  return (
    <div className="md:h-[840px] md:bg-[url(/images/home/new/Frame208.min.png)] bg-[url(/images/home/new/Frame213.min.png)] bg-cover bg-center bg-no-repeat box-border flex justify-center items-center">
      <div className="md:w-[950px] w-11/12 text-center md:py-0 py-20">
        <h3 className="font-bold md:text-6xl text-4xl md:mb-[70px] mb-8">
          Revolutionizing IP with AI in the{' '}
          <span className="text-[#E49F5C]">Web3 Landscape</span>
        </h3>
        <h4 className="md:mb-6 mb-3 text-[#E49F5C] text-base md:text-3xl font-bold">
          Round1: <br />
          The Lost Corridor
        </h4>
        <p className="md:mx-16">
          The Lost Corridor is a seemingly endless network of corridors, devoid
          of clear exits, with countless doors, rooms, and passageways, brimming
          with puzzles, magic, and mystical creatures. You find yourself
          inexorably drawn into the Lost Corridor through a coincidental
          incident. Eventually, you realize that the Lost Corridor is more than
          just a maze—it is a world brimming with secrets and puzzles. You must
          unravel the mysteries of this world, uncovering its origins and
          purpose.
        </p>
        <Button
          size="md"
          bg={'#E49F5C'}
          _hover={{ bg: '#E49F5C' }}
          px="3rem"
          mt="4rem"
          onClick={() => {
            linkBlank('https://ai.unemeta.com/');
          }}
        >
          Join Une Field
        </Button>
      </div>
    </div>
  );
}

export default Section4;
