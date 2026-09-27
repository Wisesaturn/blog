import convertString from '@/commons/lib/convertString';

/**
 * @description 목록의 글 행으로 통계 키(`카테고리/문서 ID`)를 만든다
 *
 * 목록 행에는 문서 ID 가 없고 `plain_title` 이 있다. 발행이 `plain_title` 의 공백을 `-` 로 바꿔 문서 ID 를
 * 만들고, 상세 URL(`PostRow` 의 링크)도 같은 계산을 쓴다. 통계 문서도 이 ID 로 이전했다.
 * 계산이 어긋나면 목록 숫자가 0 으로 보이기만 하고 에러가 나지 않는다.
 * @param post 목록의 글 행
 * @returns `GET /api/stats/post` 응답의 키
 * @example
 * postStatKey({ category: 'react', plain_title: 'useState 동작 원리와 클로저' });
 * // 'react/useState-동작-원리와-클로저'
 */
export default function postStatKey(post: { category: string; plain_title: string }): string {
  return `${post.category}/${convertString({ str: post.plain_title, type: 'spaceToDash' })}`;
}
