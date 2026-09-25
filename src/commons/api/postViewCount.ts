/** 조회수 API 가 돌려주는 JSON 본문. 문서가 없으면 `views` 가 `null` 이다 */
export type ViewCountBody = { views: number | null };

/**
 * @description 조회수 API 를 불러 조회수를 올리고, 올린 뒤의 값을 받는다
 * @param url 조회수 API 경로. 예: `/api/post-view/react/글-제목`
 * @param signal 화면을 떠나면 요청을 끊는 신호
 * @returns 올린 뒤의 조회수. 문서가 없거나 응답이 실패하면 null
 *
 * 브라우저에서 부른다. 같은 사람이 30분 안에 다시 부르면 서버가 쿠키를 보고 올리지 않고 지금 값만 준다.
 */
export async function postViewCount(url: string, signal?: AbortSignal): Promise<number | null> {
  const res = await fetch(url, { method: 'POST', signal });
  if (!res.ok) return null;
  const body = (await res.json()) as ViewCountBody;
  return typeof body.views === 'number' ? body.views : null;
}
