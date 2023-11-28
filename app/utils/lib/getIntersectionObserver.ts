export const getIntersectionObserver = (
  setState: (id: string) => void,
  threshold: number[],
  rootMargin?: string,
) => {
  let prevYposition = 0;

  const observerOption = {
    threshold,
    rootMargin: rootMargin ?? '0% 0px -65% -0px',
  };

  const checkScrollDirection = (prevY: number) => {
    return window.scrollY > prevY ? 'down' : 'up';
  };

  const handleIntersection = (entry: IntersectionObserverEntry) => {
    const direction = checkScrollDirection(prevYposition);

    if (entry.isIntersecting) {
      if (direction === 'up' || direction === 'down') {
        setState(entry.target.id);
      }
    }

    prevYposition = window.scrollY;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(handleIntersection);
  }, observerOption);

  return observer;
};
