import { Box, UnorderedList, ListItem } from '@chakra-ui/react';

const defHeadBg = 'linear-gradient(90deg, #0AAFEF 0%, #BBE8FA 100%)';
const defBodyBg = '#292929';
type Props = {
  introList: string[];
  ticketName: string;
  headBg?: string;
  bodyBg?: string;
};
export const TicketIntro = (props: Props) => {
  const {
    introList = [],
    ticketName = '',
    headBg = defHeadBg,
    bodyBg = defBodyBg,
  } = props;

  return (
    <>
      {/* Ticket Info Item */}
      <Box
        flex="1"
        h={{ base: 'auto', lg: '400px' }}
        w={{ base: '90vw', lg: 'auto' }}
        display="flex"
        flexDir="column"
        key={'intro-' + ticketName}
      >
        <Box
          h={{ base: '10vw', lg: '60px' }}
          bg={headBg}
          fontSize={{ base: '3.5vw', lg: '16px' }}
          color={{ base: 'white', lg: 'auto' }}
          display="flex"
          alignItems="center"
          justifyContent={{ base: 'flex-start', lg: 'center' }}
          flexShrink={0}
          pl={{ base: '5vw', lg: '0' }}
        >
          {ticketName}
        </Box>
        <Box
          border={{ base: '0.5vw solid #525252', lg: '1px solid #ccc' }}
          flex="1"
          bg={bodyBg}
          overflow="scroll"
        >
          <UnorderedList
            color={{ base: '#FFFFFFB5', lg: '#FFFFFF' }}
            pl="15px"
            pr="15px"
            pt="15px"
            pb={{ base: '5vw', lg: 'auto' }}
            fontSize="13px"
            overflow="scroll"
          >
            {introList.map((item: string) => (
              <ListItem key={'item-' + item}>{item}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      </Box>
    </>
  );
};
