import { transform } from '@babel/core';

/**
 * 해당 string이 JSX 문법인지 체크합니다
 * @param jsxString
 * @returns
 */
export default function checkJSX(jsxString: string): boolean {
  try {
    transform(jsxString, {
      presets: ['@babel/preset-react'],
    });
    return true;
  } catch {
    return false;
  }
}
