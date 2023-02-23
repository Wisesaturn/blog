import { useState, useEffect } from 'react';

type scrollDirectionType = 'up' | 'down';

export default function useScrollTopPosition() {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const [isScrollPercent, setIsScrollPercent] = useState<number>(0);
  const [isScrollTop, setIsScrollTop] = useState<boolean>(false);
  const [isScrollDirection, setIsScrollDirection] = useState<scrollDirectionType>('up');

  const [hideHeight, setHideHeight] = useState<number>(0);

  const updateScroll = () => {
    setIsScrollPercent((scrollPosition / hideHeight) * 100);
    setIsScrollTop(scrollPosition < 1);
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    setHideHeight(document.documentElement.scrollHeight - document.documentElement.clientHeight);
  };

  const checkDirectionScroll = (ev: WheelEvent) => {
    setIsScrollDirection(ev.deltaY > 0 ? 'down' : 'up');
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);

    return () => {
      window.removeEventListener('wheel', checkDirectionScroll);
    };
  });

  useEffect(() => {
    window.addEventListener('wheel', checkDirectionScroll);

    return () => {
      window.removeEventListener('wheel', checkDirectionScroll);
    };
  }, [scrollPosition]);

  return { isScrollTop, isScrollDirection, isScrollPercent };
}
