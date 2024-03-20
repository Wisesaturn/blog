type ConvertType = 'spaceToDash' | 'dashToSpace';

/**
 * @summary 문자열을 특정 패턴에 맞게 변환하는 함수
 * @returns
 */
export default function convertString(str: string, type: ConvertType) {
  if (type === 'spaceToDash') {
    return str.replace(/\s+/g, '-');
  }
  if (type === 'dashToSpace') {
    return str.replace(/-/g, ' ');
  }

  return str;
}
