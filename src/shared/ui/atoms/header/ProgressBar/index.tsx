import React, { useRef, useEffect } from 'react';

import useScroll from '$shared/hooks/useScroll';

export default function ProgressBar() {
  const { percent } = useScroll();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const setProgress = () => {
    progressBarRef.current!.style.width = `${percent}%`;
  };

  useEffect(() => {
    window.addEventListener('scroll', setProgress);
    return () => {
      window.removeEventListener('scroll', setProgress);
    };
  });

  return (
    <>
      <div ref={progressBarRef} className={`z-[10000] fixed h-0.5 bg-green-dark left-0`} />
      <div className="w-full z-[9999] fixed h-0.5 left-0" />
    </>
  );
}
