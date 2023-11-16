import { Dispatch, SetStateAction } from 'react';

import { SectionType } from '@app/routes/resume/index';

const observerOption = {
  threshold: [0.05],
  rootMargin: '0px 0px -65% -0px',
};

export const getIntersectionObserver = (setState: Dispatch<SetStateAction<SectionType>>) => {
  let prevYposition = 0;

  const checkScrollDirection = (prevY: number) => {
    return window.scrollY > prevY ? 'down' : 'up';
  };

  const handleIntersection = (entry: IntersectionObserverEntry) => {
    const direction = checkScrollDirection(prevYposition);
    console.log(entry.target.id, entry.isIntersecting, direction, entry.intersectionRatio);

    if (entry.isIntersecting) {
      if (
        (direction === 'up' && entry.intersectionRatio < 0.4) ||
        (direction === 'down' && entry.intersectionRatio < 0.4)
      ) {
        setState(entry.target.id as SectionType);
      }
    }

    prevYposition = window.scrollY;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(handleIntersection);
  }, observerOption);

  return observer;
};
