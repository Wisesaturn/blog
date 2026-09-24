/**
 * `verifyWebhookSecret` 은 발행 API 의 유일한 문이다. 통과하면 Notion 을 읽어 Firestore 에 쓰고 재배포까지 건다.
 *
 * 조용히 열리는 경우를 막는다. 서버에 시크릿이 비어 있을 때 빈 헤더나 빈 값을 통과시키면
 * 환경변수를 빠뜨린 배포에서 누구나 발행할 수 있게 된다. 화면에는 아무 이상이 보이지 않는다.
 */
import { describe, expect, it } from 'vitest';

import verifyWebhookSecret, { WEBHOOK_SECRET_HEADER } from './verifyWebhookSecret';

const SECRET = 'a1b2c3d4e5f6';

function request(headerValue?: string) {
  const headers = new Headers();
  if (headerValue !== undefined) headers.set(WEBHOOK_SECRET_HEADER, headerValue);
  return new Request('https://example.com/api/article', { method: 'POST', headers });
}

describe('시크릿이 같을 때만 통과시킨다', () => {
  it('헤더가 시크릿과 같으면 통과한다', () => {
    expect(verifyWebhookSecret(request(SECRET), SECRET)).toBe(true);
  });

  it.each([
    ['헤더가 없으면', undefined],
    ['헤더가 비어 있으면', ''],
    ['한 글자만 달라도', 'a1b2c3d4e5f7'],
    ['앞부분만 같아도', 'a1b2c3'],
    ['뒤에 글자가 붙어도', `${SECRET}0`],
  ])('%s 막는다', (_, value) => {
    expect(verifyWebhookSecret(request(value), SECRET)).toBe(false);
  });
});

describe('서버에 시크릿이 없으면 무엇이 와도 막는다', () => {
  it.each([
    ['시크릿이 undefined 이고 헤더도 없을 때', undefined, undefined],
    ['시크릿이 빈 문자열이고 헤더도 비었을 때', '', ''],
    ['시크릿이 없는데 헤더에 값이 있을 때', undefined, SECRET],
  ])('%s', (_, secret, value) => {
    expect(verifyWebhookSecret(request(value), secret)).toBe(false);
  });
});

it('헤더 이름은 대소문자를 가리지 않는다', () => {
  const headers = new Headers({ 'X-Webhook-Secret': SECRET });
  const req = new Request('https://example.com/api/article', { method: 'POST', headers });
  expect(verifyWebhookSecret(req, SECRET)).toBe(true);
});
