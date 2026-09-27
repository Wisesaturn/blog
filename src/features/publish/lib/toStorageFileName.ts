/** 파일 이름에 남길 문자. 이 밖의 문자가 이어지면 `-` 하나로 바꾼다 */
const UNSAFE_CHARS_PATTERN = /[^\p{L}\p{N}_-]+/gu;

/**
 * @description 이미지 주소에서 Storage 에 올릴 파일 이름을 만든다.
 * 괄호처럼 `encodeURIComponent` 가 인코딩하지 않는 문자가 주소에 남으면 `getStoragePaths` 가
 * 경로를 잘못 잘라, 방금 올린 파일이 옛 파일로 분류되어 지워지므로 문자, 숫자, `-`, `_` 만 남긴다 (#129)
 * @param src 원본 이미지 주소 (Notion 이 주는 S3 서명 URL, unsplash 주소 등)
 * @returns 확장자를 뗀, 주소와 Storage 경로에서 모양이 같은 파일 이름
 * @example
 * toStorageFileName('https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/def/ucluverse-team_(1).png?X-Amz-Signature=1');
 * // 'ucluverse-team_-1-'
 */
export default function toStorageFileName(src: string): string {
  // 1. 주소의 마지막 경로 조각을 꺼내고 쿼리를 뗀다
  const lastSegment = String(src.split('/').pop()).split('?')[0];

  // 2. 첫 `.` 앞까지만 남겨 확장자를 뗀다
  const basename = lastSegment.split('.')[0];

  // 3. 퍼센트 인코딩을 풀고, 자모가 나뉜(NFD) 이름은 결합 문자가 `-` 로 바뀌지 않게 먼저 합친다
  const decoded = decodeURIComponent(basename).normalize('NFC');

  // 4. 문자, 숫자, `-`, `_` 이외의 문자를 `-` 로 바꾼다
  return decoded.replace(UNSAFE_CHARS_PATTERN, '-');
}
