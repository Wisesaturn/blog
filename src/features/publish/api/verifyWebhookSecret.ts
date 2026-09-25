import { createHash, timingSafeEqual } from 'node:crypto';

export const WEBHOOK_SECRET_HEADER = 'x-webhook-secret';

/**
 * @description 발행 웹훅 요청이 `x-webhook-secret` 헤더에 서버와 같은 시크릿을 실었는지 확인한다
 * @param request 발행 API 로 들어온 요청
 * @param secret 서버가 가진 시크릿. 기본값은 `NOTION_WEBHOOK_SECRET`
 * @returns 헤더가 시크릿과 같으면 true
 *
 * 발행 API 는 Notion 을 읽어 Firestore 에 쓰고 재배포까지 거는 공개 엔드포인트라, 이 검사가 유일한 문이다.
 * 서버에 시크릿이 없으면 헤더와 상관없이 막는다. 빈 문자열끼리 같다고 통과시키지 않으려는 것이다.
 *
 * 두 값을 SHA-256 으로 같은 길이로 만든 뒤 `timingSafeEqual` 로 비교한다. 문자열을 바로 비교하면
 * 앞에서부터 몇 글자가 맞았는지가 응답 시간에 드러나고, `timingSafeEqual` 은 길이가 다르면 에러를 던진다.
 */
export default function verifyWebhookSecret(
  request: Request,
  secret: string | undefined = process.env.NOTION_WEBHOOK_SECRET,
): boolean {
  if (!secret) return false;

  const received = request.headers.get(WEBHOOK_SECRET_HEADER);
  if (!received) return false;

  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(received), digest(secret));
}
