import { useRef, useEffect } from 'react';

import { useScroll } from '@hooks/index';

export const ProgressBar = () => {
  const { isScrollPercent } = useScroll();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const checkProgress = () => {
    progressBarRef.current!.style.width = `${isScrollPercent}%`;
  };

  useEffect(() => {
    window.addEventListener('scroll', checkProgress);

    return () => {
      window.removeEventListener('scroll', checkProgress);
    };
  });

  return (
    <>
      <div className="w-full z-[9999] fixed h-1 bg-gray-200"></div>
      <div ref={progressBarRef} className={`z-[10000] fixed h-1 bg-green-800`} />
    </>
  );
};

export default ProgressBar;
