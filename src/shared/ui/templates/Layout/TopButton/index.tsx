import { useState, useEffect, useCallback } from 'react';

import Icons from '$shared/ui/atoms/icons';

export default function TopButton() {
  const [showButton, setShowButton] = useState(false);

  const handleScrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowButton(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      onClick={handleScrollTop}
      className={`fixed z-10 dark:bg-[#222] border-2 bg-white dark:border-gray-600 bottom-16 right-8 p-4 rounded-full border-gray-400 shadow-lg hover:-translate-y-1.5 ${showButton ? 'hover:cursor-pointer' : 'hover:cursor-default'}`}
      style={{
        opacity: showButton ? 1 : 0,
        transition: 'opacity 0.25s ease-in-out, transform 0.25s ease-in-out',
      }}
    >
      <Icons.ArrowUp />
    </button>
  );
}
