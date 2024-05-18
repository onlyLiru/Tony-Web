import React from 'react';
import { RevealList } from 'next-reveal';

function Title({
  title = '人物介绍',
  subTitle = 'character introduction',
}): any {
  return (
    <RevealList interval={60} delay={500} reset>
      <div className="relative flex justify-center items-center flex-col">
        <h4 className="text-white text-5xl font-extrabold relative z-10">
          {title}
        </h4>
        <h4 className="text-3xl text-slate-400 translate-y-[-1rem]">
          {subTitle}
        </h4>
      </div>
    </RevealList>
  );
}

export default Title;
