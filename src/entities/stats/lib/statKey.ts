import { type StatKind, type StatTarget } from '../model/stat';

/**
 * @description 통계 문서 ID 를 만든다. `stats/{이 값}` 이 콘텐츠 하나의 통계 문서다
 *
 * Firestore 문서 ID 에는 `/` 를 쓸 수 없다(경로 구분자). 글 키 `카테고리/제목` 의 `/` 를 `:` 로 바꾼다.
 * 제목에 `:` 가 들어 있어도(`useLens-파헤치기-:-…`) 종류와 카테고리가 앞에 고정되어 ID 는 겹치지 않는다.
 * @param target.kind 콘텐츠 종류
 * @param target.key 콘텐츠 키. 글은 `카테고리/제목`, 스니펫과 프로젝트는 제목
 * @returns 문서 ID
 * @example
 * toStatId({ kind: 'post', key: 'react/글-제목' }); // 'post:react:글-제목'
 * toStatId({ kind: 'snippet', key: 'createSafeContext' }); // 'snippet:createSafeContext'
 */
export function toStatId({ kind, key }: StatTarget): string {
  return `${kind}:${key.replaceAll('/', ':')}`;
}

/** 콘텐츠 키의 조각 수. 글은 `카테고리/제목` 이라 둘, 스니펫과 프로젝트는 제목 하나다 */
const KEY_SEGMENTS: Record<StatKind, number> = { post: 2, snippet: 1, project: 1 };

export type StatOperation = 'view' | 'like';

const OPERATIONS: readonly StatOperation[] = ['view', 'like'];

/**
 * @description 통계 API 의 splat 경로를 콘텐츠 키와 동작으로 나눈다
 *
 * 글 키에 `/` 가 들어가서 `:key` 한 조각으로 받을 수 없다. `%2F` 로 인코딩하면 서버나 CDN 이 중간에
 * `/` 로 풀어 라우트가 어긋날 수 있어, 키를 그대로 경로에 두고 splat(`$`)으로 받는다.
 * 제목에는 `/` 가 없으므로 종류별 조각 수로 키와 뒤의 동작(`view`, `like`)을 가를 수 있다.
 * @param params.kind 콘텐츠 종류
 * @param params.splat `/api/stats/:kind/` 뒤의 경로. 라우터가 디코딩한 값
 * @returns 콘텐츠 키와 동작. 동작이 없으면 조회(GET)다. 모양이 맞지 않으면 `null`
 * @example
 * parseStatPath({ kind: 'post', splat: 'react/글-제목' }); // { key: 'react/글-제목', operation: null }
 * parseStatPath({ kind: 'post', splat: 'react/글-제목/view' }); // { key: 'react/글-제목', operation: 'view' }
 * parseStatPath({ kind: 'snippet', splat: 'a/b' }); // null
 */
export function parseStatPath({
  kind,
  splat,
}: {
  kind: StatKind;
  splat: string;
}): { key: string; operation: StatOperation | null } | null {
  const segments = splat.split('/');
  if (segments.some((segment) => segment === '')) return null;

  const size = KEY_SEGMENTS[kind];
  const key = segments.slice(0, size).join('/');
  const rest = segments.slice(size);

  if (segments.length < size) return null;
  if (rest.length === 0) return { key, operation: null };
  if (rest.length === 1 && OPERATIONS.includes(rest[0] as StatOperation)) {
    return { key, operation: rest[0] as StatOperation };
  }
  return null;
}
