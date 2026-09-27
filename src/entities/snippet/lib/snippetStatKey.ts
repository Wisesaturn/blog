import convertString from '@/commons/lib/convertString';

/**
 * @description 목록의 스니펫 카드로 통계 키(문서 ID)를 만든다. 발행이 `plainTitle` 의 공백을 `-` 로 바꿔 문서 ID 를 만든다
 * @param snippet 목록의 스니펫
 * @returns `GET /api/stats/snippet` 응답의 키
 * @example
 * snippetStatKey({ plainTitle: 'createSafeContext' }); // 'createSafeContext'
 */
export default function snippetStatKey(snippet: { plainTitle: string }): string {
  return convertString({ str: snippet.plainTitle, type: 'spaceToDash' });
}
