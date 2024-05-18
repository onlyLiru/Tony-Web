import React, { useState } from 'react';
import MobileIndex from './MobileIndex';
import MobileDesc from './MobileDesc';

function Mobile({
  current,
  currentUser,
  handleSelect,
  users,
}: {
  current: number;
  currentUser: any;
  handleSelect: (key: number) => void;
  users: any;
}) {
  const [currentPage, setPage] = useState('index');

  const navigatePage = (v: string) => {
    setPage(v);
  };

  return (
    <div className="md:hidden min-h-[60vh] bg-[#000]">
      {currentPage === 'index' ? (
        <MobileIndex
          {...{ current, currentUser, handleSelect, navigatePage, users }}
        />
      ) : (
        <MobileDesc {...{ current, currentUser, handleSelect, navigatePage }} />
      )}
    </div>
  );
}

export default Mobile;
