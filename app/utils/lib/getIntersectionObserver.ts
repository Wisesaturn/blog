import { Dispatch, SetStateAction } from 'react';

import { SectionType } from '@app/routes/resume/index';

const observerOption = {
  threshold: [0.5],
  rootMargin: '0px 0px -50% -0px',
};

export const getIntersectionObserver = (setState: Dispatch<SetStateAction<SectionType>>) => {
  let prevYposition = 0;

  const checkScrollDirection = (prevY: number) => {
    return window.scrollY > prevY ? 'down' : 'up';
  };

  const handleIntersection = (entry: IntersectionObserverEntry) => {
    const direction = checkScrollDirection(prevYposition);
    console.log(entry.target.id, entry.isIntersecting, direction, entry);

    if (
      (direction === 'down' && entry.isIntersecting) ||
      (direction === 'up' && entry.isIntersecting)
    ) {
      setState(entry.target.id as SectionType);
    }

    prevYposition = window.scrollY;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(handleIntersection);
  }, observerOption);

  return observer;
};
