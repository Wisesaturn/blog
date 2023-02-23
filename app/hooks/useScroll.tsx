import { useState, useEffect } from 'react';

type scrollDirectionType = 'up' | 'down';

export default function useScrollTopPosition() {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isScrollTop, setIsScrollTop] = useState<boolean>(false);
  const [isScrollDirection, setIsScrollDirection] = useState<scrollDirectionType>('up');

  const updateScroll = () => {
    setScrollPosition(window.scrollY || document.documentElement.scrollTop);
  };

  const checkDirectionScroll = (ev: WheelEvent) => {
    setIsScrollDirection(ev.deltaY > 0 ? 'down' : 'up');
  };

  useEffect(() => {
    window.addEventListener('scroll', updateScroll);
    setIsScrollTop(scrollPosition === 0);
  }, [scrollPosition]);

  useEffect(() => {
    window.addEventListener('wheel', checkDirectionScroll);
  }, [scrollPosition]);

  return { isScrollTop, isScrollDirection };
}
