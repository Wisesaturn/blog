/**
 * @summary 특정 id 태그의 옵저버를 만드는 함수
 * @param callback callback function
 * @param threshold 경계선
 * @param rootMargin 경계선 영역
 * @returns
 */
export default function getIntersectionObserver(
  callback: (id: string) => void,
  threshold: number[],
  rootMargin?: string,
) {
  let prevYposition = 0;

  const observerOption = {
    threshold,
    rootMargin: rootMargin ?? '0% 0px -65% -0px',
  };

  const checkScrollDirection = (prevY: number) => (window.scrollY > prevY ? 'down' : 'up');

  const handleIntersection = (entry: IntersectionObserverEntry) => {
    const direction = checkScrollDirection(prevYposition);

    if (entry.isIntersecting) {
      if (direction === 'up' || direction === 'down') {
        callback(entry.target.id);
      }
    }

    prevYposition = window.scrollY;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(handleIntersection);
  }, observerOption);

  return observer;
}
