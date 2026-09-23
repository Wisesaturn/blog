export type ViewKind = 'post' | 'snippet' | 'project';

/**
 * @description 조회수 중복 방지 쿠키의 이름을 글마다 다르게 만든다
 *
 * 예전에는 URL 경로에서 영문과 숫자만 남겨 이름을 만들었다. 한글 제목은 전부 지워져
 * `posts-typescript` 처럼 카테고리까지만 남았고, 같은 카테고리의 한글 제목 글이 쿠키 하나를
 * 나눠 썼다. 한 글을 읽으면 그 카테고리의 다른 글도 30분 동안 조회수가 오르지 않았다.
 *
 * 쿠키 이름에는 한글을 넣을 수 없어서 글 키를 UTF-8 바이트 기준 FNV-1a 32비트 해시로 바꿔 붙인다.
 * @param kind 콘텐츠 종류
 * @param key Firestore 문서를 가리키는 키. 글은 `카테고리/제목`, 스니펫과 프로젝트는 제목
 * @returns `view-{kind}-{16진수 8자리}`
 * @example
 * viewCookieName('post', 'typescript/함수-타입-선언하기'); // 'view-post-…'
 */
export default function viewCookieName(kind: ViewKind, key: string): string {
  let hash = 0x811c9dc5;
  new TextEncoder().encode(key).forEach((byte) => {
    // eslint-disable-next-line no-bitwise
    hash = Math.imul(hash ^ byte, 0x01000193);
  });
  // eslint-disable-next-line no-bitwise
  return `view-${kind}-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
