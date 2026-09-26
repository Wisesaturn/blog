/** `uploadImage` 가 돌려주는 공개 주소의 앞부분. 뒤에 버킷 이름과 인코딩된 파일 경로가 온다 */
const STORAGE_URL_PATTERN = /https:\/\/storage\.googleapis\.com\/[^/\s"'<>)]+\/([^\s"'<>)?#]+)/g;

/**
 * @description 문서의 썸네일과 본문에 들어 있는 Storage 주소를 파일 경로로 바꿔 모은다.
 * 발행 뒤 옛 파일을 지울 때 이 경로들은 남긴다
 * @param texts 썸네일 주소, 본문 HTML 등 Storage 주소가 들어 있을 수 있는 문자열
 * @returns Storage 의 `fullPath` 형식(`post/react/글-제목/파일.webp`) 경로 집합
 * @example
 * getStoragePaths('https://storage.googleapis.com/bucket/post%2Freact%2Fa%2Fb.webp');
 * // Set { 'post/react/a/b.webp' }
 */
export default function getStoragePaths(...texts: string[]): Set<string> {
  const paths = new Set<string>();

  texts.forEach((text) => {
    Array.from(text.matchAll(STORAGE_URL_PATTERN)).forEach(([, encodedPath]) => {
      try {
        paths.add(decodeURIComponent(encodedPath));
      } catch {
        // 잘린 퍼센트 인코딩은 파일 경로가 아니므로 남길 목록에 넣지 않는다
      }
    });
  });

  return paths;
}
