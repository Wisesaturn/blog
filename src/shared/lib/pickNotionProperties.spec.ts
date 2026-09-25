/**
 * `pickNotionProperties` 는 발행 API 가 Notion 속성을 읽기 전에 거치는 관문이다.
 *
 * 예전에는 SDK 응답을 `as unknown as` 로 단언해서, Notion 에서 속성 이름을 바꾸거나 지우면
 * 발행 도중에 `Cannot read properties of undefined` 로 터졌다. 어느 속성이 문제인지는 로그로 알 수 없었다.
 * 여기서는 어긋난 속성을 모두 이름으로 적어 발행 전에 멈추는지를 고정한다.
 */
import { describe, expect, it } from 'vitest';

import pickNotionProperties from './pickNotionProperties';

const title = { id: 'title', type: 'title', title: [] };
const select = { id: 's', type: 'select', select: null };
const multiSelect = { id: 'm', type: 'multi_select', multi_select: [] };
const richText = { id: 'r', type: 'rich_text', rich_text: [] };

type Properties = Parameters<typeof pickNotionProperties>[0];

const POST_PROPERTIES = {
  이름: title,
  category: select,
  tags: multiSelect,
  description: richText,
  // 스키마에 없는 속성은 있어도 된다
  createdAt: { id: 'c', type: 'created_time', created_time: '2026-09-25T00:00:00.000Z' },
} as unknown as Properties;

function without(...names: string[]): Properties {
  return Object.fromEntries(
    Object.entries(POST_PROPERTIES).filter(([name]) => !names.includes(name)),
  ) as Properties;
}

it('스키마와 맞으면 받은 속성을 그대로 돌려준다', () => {
  expect(pickNotionProperties(POST_PROPERTIES, 'post')).toBe(POST_PROPERTIES);
});

describe('스키마와 다르면 어긋난 속성을 적은 에러를 낸다', () => {
  it('속성이 없으면 이름을 적는다', () => {
    expect(() => pickNotionProperties(without('tags'), 'post')).toThrow('tags 속성이 없습니다');
  });

  it('타입이 다르면 기대한 타입과 실제 타입을 적는다', () => {
    const properties = { ...POST_PROPERTIES, category: multiSelect } as Properties;

    expect(() => pickNotionProperties(properties, 'post')).toThrow(
      'category 속성이 select 가 아니라 multi_select 입니다',
    );
  });

  it('여러 속성이 어긋나면 하나에서 멈추지 않고 모두 적는다', () => {
    expect(() => pickNotionProperties(without('이름', 'description'), 'post')).toThrow(
      'Notion post 페이지의 속성이 발행 스키마와 다릅니다: 이름 속성이 없습니다, description 속성이 없습니다',
    );
  });

  it('글 스키마에 맞는 페이지도 프로젝트 스키마로 검사하면 막힌다', () => {
    expect(() => pickNotionProperties(POST_PROPERTIES, 'project')).toThrow('theme 속성이 없습니다');
  });
});
