import { createRequire } from 'module';
import path from 'path';

const babel = createRequire(import.meta.url)(path.join(process.cwd(), 'node_modules/@babel/core'));

/**
 * 해당 string이 JSX 문법인지 체크합니다
 * @param jsxString
 * @returns
 */
export default function checkJSX(jsxString: string): boolean {
  try {
    babel.transform(jsxString, {
      presets: ['@babel/preset-react'],
    });
    return true;
  } catch (e) {
    return false;
  }
}
