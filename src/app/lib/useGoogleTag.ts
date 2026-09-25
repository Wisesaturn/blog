import { useEffect } from 'react';

/**
 * @summary 렌더링 이후 스크립트 태그를 추가하는 hook
 */
export default function useInitialScript() {
  // Google Tag
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return () => {};

    const googleTag = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
  
      gtag('config', 'G-3F4JB1BK0P');
    `;

    const script = document.createElement('script');
    script.appendChild(document.createTextNode(googleTag));
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
}
