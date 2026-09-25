/**
 * `parseDocuments` 와 `parseDocument` 는 Firestore 문서를 도메인 스키마로 검사한다.
 *
 * 목록은 문서 하나가 틀려도 페이지와 sitemap 이 살아 있어야 해서 건너뛰고, 단건은 틀린 값을
 * 화면에 그리지 않도록 에러를 낸다. 건너뛴 문서는 경고로 남아야 Vercel 로그에서 찾을 수 있다.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { parseDocument, parseDocuments } from './firestoreDocument';

const schema = z.object({ title: z.string(), views: z.number() });

const doc = (path: string, data: Record<string, unknown> | undefined) => ({
  ref: { path },
  data: () => data,
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('parseDocuments 는 스키마와 맞지 않는 문서를 건너뛴다', () => {
  it('맞는 문서만 돌려주고, 건너뛴 문서의 경로와 필드를 경고로 남긴다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = parseDocuments(schema, [
      doc('react/글', { title: '글', views: 3 }),
      doc('react/유령', { reactions: { thumbsup: 1 } }),
    ]);

    expect(result).toEqual([{ title: '글', views: 3 }]);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('react/유령 문서가 스키마와 달라 건너뜁니다');
    expect(warn.mock.calls[0][0]).toContain('title');
  });

  it('스키마에 없는 필드는 결과에서 뺀다', () => {
    const result = parseDocuments(schema, [doc('a/b', { title: '글', views: 1, reactions: {} })]);

    expect(result).toEqual([{ title: '글', views: 1 }]);
  });
});

describe('parseDocument 는 스키마와 다르면 에러를 낸다', () => {
  it('맞으면 값을 돌려준다', () => {
    expect(parseDocument(schema, doc('a/b', { title: '글', views: 1 }))).toEqual({
      title: '글',
      views: 1,
    });
  });

  it('다르면 문서 경로와 어긋난 필드를 적는다', () => {
    expect(() => parseDocument(schema, doc('react/글', { title: 1, views: 1 }))).toThrow(
      /^react\/글 문서가 스키마와 다릅니다: title: /,
    );
  });

  it('없는 필드는 이름만 모아서 적는다. 유령 문서는 필드가 전부 없어 로그가 길어진다', () => {
    expect(() => parseDocument(schema, doc('react/유령', { reactions: {} }))).toThrow(
      'react/유령 문서가 스키마와 다릅니다: 없는 필드 title, views',
    );
  });
});
