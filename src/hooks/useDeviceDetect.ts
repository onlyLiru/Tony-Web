import React from 'react';
import _ from 'lodash';

export default function useDeviceDetect() {
  const [isMobile, setMobile] = React.useState(false);

  React.useEffect(() => {
    const getMobile = () => {
      const userAgent =
        typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
        ),
      );
      setMobile(mobile);
    };
    getMobile();
    const debounceGetMobile = _.debounce(getMobile, 150);

    window.addEventListener('resize', debounceGetMobile);

    return () => {
      window.removeEventListener('resize', debounceGetMobile);
    };
  }, []);

  return { isMobile };
}
