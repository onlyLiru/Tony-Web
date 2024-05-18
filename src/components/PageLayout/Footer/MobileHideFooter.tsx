import { Box, BoxProps } from '@chakra-ui/react';
import { Footer } from './Footer';

export function MobileHideFooter(props: BoxProps) {
  return (
    <Box display={{ base: 'none', md: 'block' }} {...props}>
      <Footer />
    </Box>
  );
}
