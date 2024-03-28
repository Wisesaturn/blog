import { useEffect } from 'react';

/**
 * @summary Codepen 3rd party load hook
 */
export default function useCodePen() {
  // codepen load
  useEffect(() => {
    const codepenScript = `https://cpwebassets.codepen.io/assets/embed/ei.js`;
    const script = document.createElement('script');
    script.async = true;
    script.src = codepenScript;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
}
