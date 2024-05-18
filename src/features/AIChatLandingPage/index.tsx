import React, { useState } from 'react';
import 'animate.css';

import Mobile from './Mobile';
import { Footer } from '@/components/PageLayout';

import { useTranslations } from 'next-intl';
import VideoSec from './VideoSec';
import PersonSec from './PersonSec';
import StorySec from './StorySec';
import ShadowSec from './ShadowSec';
import EventSec from './EventSec';

function AiLandingPage() {
  const t = useTranslations('landingpage');
  const users = t.raw('persons');
  const [current, setCur] = useState(0);
  const currentUser = users[current];

  const handleSelect = (key: number) => {
    setCur(key);
  };

  return (
    <div className="bg-black">
      <Mobile {...{ current, currentUser, handleSelect, users }} />
      <div className="overflow-hidden hidden md:block">
        <VideoSec />

        <PersonSec {...{ current, handleSelect, users }} />

        <StorySec />

        <ShadowSec />

        <EventSec />
      </div>
      <Footer />
    </div>
  );
}

export default AiLandingPage;
