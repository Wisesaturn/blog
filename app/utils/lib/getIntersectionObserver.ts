import { Dispatch, SetStateAction } from 'react';

import { SectionType } from '@app/routes/resume/index';

const observerOption = {
  threshold: 0.7,
  rootMargin: '40px 0px 0px 0px',
};

export const getIntersectionObserver = (setState: Dispatch<SetStateAction<SectionType>>) => {
  let direction = '';
  let prevYposition = 0;

  // 스크롤 방향 확인 (up / down)
  const checkScrollDirection = (prevY: number) => {
    if (window.scrollY === 0 && prevY === 0) return;
    if (window.scrollY > prevY) direction = 'down';
    else direction = 'up';

    prevYposition = window.scrollY;
  };

  // register observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      checkScrollDirection(prevYposition);

      if (
        (direction === 'down' && !entry.isIntersecting) ||
        (direction === 'up' && entry.isIntersecting)
      ) {
        setState(entry.target.id as SectionType);
      }
    });
  }, observerOption);

  return observer;
};
