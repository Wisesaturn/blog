import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down';

/**
 * @summary 사용자의 스크롤에 관한 결과를 추출하는 hook
 * @returns
 */
export default function useScroll() {
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  const [percent, setPercent] = useState<number>(0);
  const [isScrollTop, setIsScrollTop] = useState<boolean>(true);
  const [direction, setDirection] = useState<ScrollDirection>('up');

  const [hideHeight, setHideHeight] = useState<number>(0);

  const updateScroll = () => {
    setPercent((scrollPosition / hideHeight) * 100);
    setIsScrollTop(scrollPosition < 1);
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    setHideHeight(document.documentElement.scrollHeight - document.documentElement.clientHeight);
  };

  const checkDirectionScroll = (ev: WheelEvent) => {
    setDirection(ev.deltaY > 0 ? 'down' : 'up');
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);

    return () => {
      window.removeEventListener('scroll', updateScroll);
    };
  });

  useEffect(() => {
    window.addEventListener('wheel', checkDirectionScroll);

    return () => {
      window.removeEventListener('wheel', checkDirectionScroll);
    };
  }, [scrollPosition]);

  return { isScrollTop, direction, percent };
}
