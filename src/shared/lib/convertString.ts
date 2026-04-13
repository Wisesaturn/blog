import Logger from '$shared/helper/logger';

type ConvertType = 'spaceToDash' | 'dashToSpace' | 'urlPathToCookieName';

/**
 * @summary 문자열을 특정 패턴에 맞게 변환하는 함수
 * @returns
 */
export default function convertString(str: string, type: ConvertType) {
  if (typeof str !== 'string') {
    const NotStringError = new Error('입력받은 문자열이 올바르지 않습니다.');
    Logger.error(NotStringError);
    throw NotStringError;
  }

  if (type === 'spaceToDash') {
    return str.replace(/\s+/g, '-');
  }
  if (type === 'dashToSpace') {
    return str.replace(/-/g, ' ');
  }
  if (type === 'urlPathToCookieName') {
    const result = str
      .replace(/%[0-9A-Fa-f]{2}/g, '-')
      .replace(/[^a-zA-Z0-9_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return result || 'page';
  }

  return str;
}
