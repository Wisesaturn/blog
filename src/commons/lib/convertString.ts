import Logger from './logger';

type ConvertType = 'spaceToDash' | 'dashToSpace';

/**
 * @description 문자열의 공백과 `-` 를 서로 바꾼다. 제목을 URL 조각으로 만들 때 쓴다
 * @param params.str 바꿀 문자열
 * @param params.type `spaceToDash` 는 공백을 `-` 로, `dashToSpace` 는 `-` 를 공백으로 바꾼다
 * @returns 바꾼 문자열
 * @throws `str` 이 문자열이 아니면 에러
 * @example
 * convertString({ str: 'e2e 테스트 도입기', type: 'spaceToDash' }); // 'e2e-테스트-도입기'
 */
export default function convertString({ str, type }: { str: string; type: ConvertType }) {
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

  return str;
}
