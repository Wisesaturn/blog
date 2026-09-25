/**
 * `getWebhookPageId` 는 발행 API 가 무엇을 발행할지 정하는 첫 단계다.
 *
 * 본문 모양은 추측이 아니라 Notion 버튼이 실제로 보낸 요청을 Vercel 로그로 받아 확인한 것이다.
 * 예전 API 는 `{ title }` 을 받았는데, Notion 본문에는 `title` 이 없어 `undefined` 로 제목 검색을 하다가
 * 제목이 빈 페이지를 고른 적이 있다. 그래서 형식이 다르면 조용히 넘기지 않고 에러를 낸다.
 */
import { describe, expect, it } from 'vitest';

import getWebhookPageId from './getWebhookPageId';

// 2026-09-24 에 "마크다운 테스트" 페이지의 버튼이 보낸 본문에서 식별자를 줄이고 속성 일부만 남겼다
const NOTION_WEBHOOK_BODY = {
  source: {
    type: 'automation',
    automation_id: 'auto-1',
    action_id: 'act-1',
    event_id: 'evt-1',
    attempt: 1,
  },
  data: {
    object: 'page',
    id: 'a31f4f15-2291-49ec-b1e0-4909a26147de',
    parent: {
      type: 'data_source_id',
      data_source_id: 'ds-1',
      database_id: '997a25ce-6805-49ea-b3da-8914fc07a392',
    },
    properties: {
      이름: { id: 'title', type: 'title', title: [{ plain_text: '마크다운 테스트' }] },
      category: { id: 'jix', type: 'select', select: { name: 'LOCAL_TEST' } },
    },
  },
};

it('Notion 웹훅 본문에서 누른 페이지의 ID 를 꺼낸다', () => {
  expect(getWebhookPageId(NOTION_WEBHOOK_BODY)).toBe('a31f4f15-2291-49ec-b1e0-4909a26147de');
});

describe('Notion 페이지 웹훅 형식이 아니면 에러를 낸다', () => {
  it.each([
    ['예전 형식 { title }', { title: '마크다운 테스트' }],
    ['data 가 없음', { source: {} }],
    ['data 가 페이지가 아님', { data: { object: 'database', id: 'x' } }],
    ['id 가 없음', { data: { object: 'page' } }],
    ['id 가 빈 문자열', { data: { object: 'page', id: '' } }],
    ['id 가 문자열이 아님', { data: { object: 'page', id: 123 } }],
    ['null', null],
    ['문자열', 'hello'],
  ])('%s', (_, body) => {
    expect(() => getWebhookPageId(body)).toThrow('Notion 페이지 웹훅 본문이 아닙니다');
  });
});
