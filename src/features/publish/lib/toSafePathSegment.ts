/** 경로 조각에 남길 문자. 이 밖의 문자가 이어지면 `-` 하나로 바꾼다 */
const UNSAFE_CHARS_PATTERN = /[^\p{L}\p{N}_-]+/gu;

/**
 * @description Storage 경로 조각(폴더 이름, 파일 이름)에서 문자, 숫자, `-`, `_` 만 남기고 나머지를 `-` 로 바꾼다.
 * 괄호처럼 `encodeURIComponent` 가 인코딩하지 않는 문자가 주소에 남으면 `getStoragePaths` 가
 * 경로를 잘못 잘라, 방금 올린 파일이 옛 파일로 분류되어 지워진다 (#129, #131)
 * @param name 경로 조각 하나. `/` 가 들어 있으면 `-` 로 바뀐다
 * @returns 주소와 Storage 경로에서 모양이 같은 경로 조각
 * @example
 * toSafePathSegment('쌩-npm으로-MFE-구축하기-(1)-:-개념'); // '쌩-npm으로-MFE-구축하기-1-개념'
 */
export default function toSafePathSegment(name: string): string {
  // 자모가 나뉜(NFD) 이름은 결합 문자가 `-` 로 바뀌지 않게 먼저 합친다
  return (
    name
      .normalize('NFC')
      .replace(UNSAFE_CHARS_PATTERN, '-')
      // 공백을 `-` 로 바꾼 제목(`-(1)-:-`)에서 `-` 가 여럿 이어지지 않게 합친다
      .replace(/-{2,}/g, '-')
  );
}
