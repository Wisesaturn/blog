// 브라우저가 우리 API 라우트를 부를 때 쓴다. 클라이언트 번들에 들어가므로 가벼운 zod/mini 를 쓴다
import * as z from 'zod/mini';

/**
 * API 가 실패 상태 코드로 응답했다. 화면이 상태 코드로 다르게 반응할 수 있게 담아 둔다
 * (예: 429 면 잠시 뒤에 다시, 403 이면 권한 없음).
 *
 * 응답 모양이 스키마와 다른 경우는 이 에러가 아니라 zod 검사 에러(`z.core.$ZodError`)다. 서버와 클라이언트의
 * 약속이 깨졌다는 뜻이다.
 */
export class ApiError extends Error {
  readonly status: number;

  readonly url: string;

  /** 실패 응답의 본문. JSON 이 아니면 `null` */
  readonly body: unknown;

  constructor({ status, url, body }: { status: number; url: string; body: unknown }) {
    super(`API 가 ${status} 로 응답했습니다: ${url}`);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

interface RequestJsonParams<S extends z.core.$ZodType> extends Omit<RequestInit, 'body'> {
  /** 부를 경로 (예: `/api/stats/post`) */
  url: string;
  /** 성공 응답 본문의 스키마. `zod` 와 `zod/mini` 스키마를 모두 받는다 */
  schema: S;
  /** 있으면 JSON 으로 직렬화해 본문으로 보내고 `Content-Type` 을 붙인다 */
  json?: unknown;
}

/**
 * @description API 를 부르고 응답 본문을 zod 스키마로 검사해 돌려준다
 *
 * TanStack Query 의 `queryFn`, `mutationFn` 에서 부르는 것을 전제로 한다. 실패는 모두 던져서
 * `useQuery`, `useMutation` 이 에러로 받게 한다.
 * @param params.url 부를 경로 (예: `/api/stats/post`)
 * @param params.schema 성공 응답 본문의 스키마. `zod` 와 `zod/mini` 스키마를 모두 받는다
 * @param params.json 있으면 JSON 본문으로 보낸다
 * @param params 나머지는 `fetch` 옵션이다. `signal`, `method`, `headers`, `keepalive` 등을 그대로 넘긴다
 * @returns 스키마를 통과한 값
 * @throws 상태 코드가 실패면 `ApiError`, 본문이 스키마와 다르면 `z.core.$ZodError`
 * @example
 * const stat = await requestJson({ url: '/api/stats/post/react/글', schema: statValues, signal });
 * const { likes } = await requestJson({ url, schema: likeResult, method: 'POST', json: { count: 3 } });
 */
export async function requestJson<S extends z.core.$ZodType>({
  url,
  schema,
  json,
  headers,
  ...rest
}: RequestJsonParams<S>): Promise<z.output<S>> {
  const requestHeaders = new Headers(headers);
  if (json !== undefined) requestHeaders.set('Content-Type', 'application/json');

  const res = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body: json === undefined ? undefined : JSON.stringify(json),
  });

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    throw new ApiError({ status: res.status, url, body });
  }
  return z.parse(schema, await res.json());
}
