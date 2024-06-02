import { useCallback, useEffect, useState } from 'react';

import getIntersectionObserver from '$features/post/lib/getIntersectionObserver';

/**
 * @summary TOC 컴포넌트에서 사용하는 훅
 * @description 전체 Heading 태그와 뷰포트 내 제목 id를 구합니다
 */
export default function useTOC() {
  const [selectId, setSelectId] = useState('');

  const handleSelectId = useCallback((id: string) => {
    setSelectId(id);
  }, []);

  // TOC Intersection Observer
  useEffect(() => {
    const Observer = getIntersectionObserver(handleSelectId, [0.5], '0% 0px -65% -0px');
    const HeadingElements = Array.from(document.querySelectorAll('.markdown-body h2,h3,h4'));
    const ArticleTitleElement = document.querySelectorAll('#article-title');

    HeadingElements.forEach((head) => Observer.observe(head));
    Observer.observe(ArticleTitleElement[0]);

    return () => {
      Observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { selectId };
}
