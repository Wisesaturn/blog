/**
 * `notionProperty` 스키마는 발행 API 가 Notion 속성을 읽기 전에 거치는 관문이다.
 *
 * 예전에는 SDK 응답을 `as unknown as` 로 단언해서, Notion 에서 속성 이름을 바꾸거나 값을 비우면
 * 발행 도중에 `Cannot read properties of undefined` 로 터졌다. 어느 속성이 문제인지 로그로 알 수 없었고,
 * 빈 제목은 Firestore 문서 ID 가 빈 문자열이 될 뻔했다.
 *
 * 여기서는 두 가지를 고정한다.
 * - 꼭 필요한 값(제목, select, 기간)은 비면 멈추고, 없어도 되는 값(텍스트, URL)은 빈 값으로 둔다
 * - 어긋나면 어떤 속성이 왜 어긋났는지 모두 적는다
 */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
  formatNotionIssues,
  notionDate,
  notionMultiSelectNames,
  notionSelectName,
  notionText,
  notionTitle,
  notionUrl,
} from './notionProperty';

const text = (...parts: string[]) => parts.map((plainText) => ({ plain_text: plainText }));

describe('notionTitle 은 제목의 첫 조각을 꺼낸다', () => {
  it('조각이 여럿이어도 첫 조각만 쓴다. 이어 붙이면 기존 글의 문서 ID 가 바뀐다', () => {
    const title = { id: 'title', type: 'title', title: text('useState ', '동작 원리') };

    expect(notionTitle.parse(title)).toBe('useState ');
  });

  it('비어 있으면 에러다', () => {
    expect(() => notionTitle.parse({ id: 'title', type: 'title', title: [] })).toThrow(
      '값이 비어 있습니다',
    );
  });
});

describe('notionText 는 텍스트의 첫 조각을 꺼낸다', () => {
  it('비어 있으면 빈 문자열이다', () => {
    expect(notionText.parse({ id: 'r', type: 'rich_text', rich_text: [] })).toBe('');
  });
});

describe('notionSelectName 은 선택한 항목의 이름을 꺼낸다', () => {
  it('선택되어 있으면 이름이다', () => {
    expect(notionSelectName.parse({ id: 's', type: 'select', select: { name: 'react' } })).toBe(
      'react',
    );
  });

  it('선택하지 않았으면 에러다. 글 카테고리는 컬렉션 이름이 된다', () => {
    expect(() => notionSelectName.parse({ id: 's', type: 'select', select: null })).toThrow(
      '값이 비어 있습니다',
    );
  });
});

it('notionMultiSelectNames 는 항목 이름 목록을 꺼낸다', () => {
  const tags = { id: 'm', type: 'multi_select', multi_select: [{ name: 'a' }, { name: 'b' }] };

  expect(notionMultiSelectNames.parse(tags)).toEqual(['a', 'b']);
});

it('notionUrl 은 비어 있으면 null 을 그대로 둔다', () => {
  expect(notionUrl.parse({ id: 'u', type: 'url', url: null })).toBeNull();
});

describe('notionDate 는 기간을 꺼낸다', () => {
  it('진행 중이라 끝 날짜가 없으면 end 가 null 이다', () => {
    const date = {
      id: 'd',
      type: 'date',
      date: { start: '2024-01-01', end: null, time_zone: null },
    };

    expect(notionDate.parse(date)).toEqual({ start: '2024-01-01', end: null });
  });

  it('기간이 비어 있으면 에러다', () => {
    expect(() => notionDate.parse({ id: 'd', type: 'date', date: null })).toThrow(
      '값이 비어 있습니다',
    );
  });
});

describe('formatNotionIssues 는 어긋난 속성을 모두 이름과 이유로 적는다', () => {
  const schema = z.object({
    이름: notionTitle,
    category: notionSelectName,
    tags: notionMultiSelectNames,
  });

  const issuesOf = (properties: unknown) => {
    const result = schema.safeParse(properties);
    if (result.success) throw new Error('검사를 통과하면 안 된다');
    return formatNotionIssues(result.error);
  };

  it('속성이 없으면 속성이 없다고 적는다', () => {
    const properties = {
      이름: { id: 'title', type: 'title', title: text('제목') },
      category: { id: 's', type: 'select', select: { name: 'react' } },
    };

    expect(issuesOf(properties)).toBe('tags: 속성이 없습니다');
  });

  it('타입이 다르면 기대한 타입과 실제 타입을 적고, 하나에서 멈추지 않는다', () => {
    const properties = {
      이름: { id: 'title', type: 'title', title: [] },
      category: { id: 'm', type: 'multi_select', multi_select: [] },
      tags: { id: 'm', type: 'multi_select', multi_select: [] },
    };

    expect(issuesOf(properties)).toBe(
      '이름: 값이 비어 있습니다, category.type: select 가 아니라 multi_select 입니다, category.select: 값이 비어 있습니다',
    );
  });
});
