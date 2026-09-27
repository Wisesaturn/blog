/**
 * 브라우저에서 우리 통계 API 라우트(BFF)를 부르는 함수들이다. 이름의 `.client` 때문에 서버 번들에서는
 * 빈 모듈이 된다. 서버 코드는 `apis.ts` 를 쓴다.
 */

import { requestJson } from '@/commons/api/requestJson';

import {
  likeResult,
  statMap,
  statValues,
  viewResult,
  type StatKind,
  type StatMap,
  type StatValues,
} from '../model/stat';

/**
 * @description 통계 API 경로를 만든다. 글 키의 `/` 는 인코딩하지 않고 경로 조각으로 둔다 (`parseStatPath`)
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키. 없으면 목록 경로
 * @param operation 뒤에 붙일 동작
 * @returns `/api/stats/post/react/글-제목/view` 같은 경로
 */
export function statPath(kind: StatKind, key?: string, operation?: 'view' | 'like'): string {
  const segments = [
    'api',
    'stats',
    kind,
    ...(key ? key.split('/') : []),
    ...(operation ? [operation] : []),
  ];
  return `/${segments.map(encodeURIComponent).join('/')}`;
}

/**
 * @description 한 종류의 통계를 전부 받는다 (브라우저)
 * @param kind 콘텐츠 종류
 * @param signal 화면을 떠나면 요청을 끊는 신호
 * @returns 콘텐츠 키별 `{ views, likes }`
 */
export async function fetchStats(kind: StatKind, signal?: AbortSignal): Promise<StatMap> {
  return requestJson(statPath(kind), statMap, { signal });
}

/**
 * @description 콘텐츠 하나의 통계를 받는다 (브라우저)
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @param signal 화면을 떠나면 요청을 끊는 신호
 * @returns `{ views, likes }`
 */
export async function fetchStat(
  kind: StatKind,
  key: string,
  signal?: AbortSignal,
): Promise<StatValues> {
  return requestJson(statPath(kind, key), statValues, { signal });
}

/**
 * @description 조회수를 올리고 올린 뒤의 값을 받는다 (브라우저)
 *
 * 같은 사람이 30분 안에 다시 부르면 서버가 쿠키를 보고 올리지 않고 지금 값만 준다.
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @param signal 화면을 떠나면 요청을 끊는 신호
 * @returns 올린 뒤의 조회수
 */
export async function postView(kind: StatKind, key: string, signal?: AbortSignal): Promise<number> {
  const { views } = await requestJson(statPath(kind, key, 'view'), viewResult, {
    method: 'POST',
    signal,
  });
  return views;
}

/**
 * @description 쓰로틀로 모은 좋아요를 보내고 올린 뒤의 값을 받는다 (브라우저)
 * @param kind 콘텐츠 종류
 * @param key 콘텐츠 키
 * @param count 올릴 수 (1~100)
 * @param keepalive 페이지를 떠나는 중이면 true. 탭을 닫아도 요청이 끝까지 간다
 * @returns 올린 뒤의 좋아요 수
 */
export async function postLike(
  kind: StatKind,
  key: string,
  count: number,
  keepalive = false,
): Promise<number> {
  const { likes } = await requestJson(statPath(kind, key, 'like'), likeResult, {
    method: 'POST',
    json: { count },
    keepalive,
  });
  return likes;
}
