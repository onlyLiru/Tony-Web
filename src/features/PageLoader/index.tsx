import { Progress } from '@chakra-ui/react';
import { Router } from 'next/router';
import React from 'react';

export default function PageLoader() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const handleRouteStart = () => setShow(true);
    const handleRouteDone = () => setShow(false);

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);
  if (show)
    return (
      <Progress
        bg="transparent"
        zIndex={100}
        pos="fixed"
        top="0"
        right="0"
        left="0"
        size="xs"
        isIndeterminate
      />
    );
  return null;
}
