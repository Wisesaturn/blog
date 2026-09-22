/**
 * `sortPosts` 는 목록 페이지의 정렬을 맡는다. `?orderby=` 값이 그대로 들어온다.
 *
 * 두 가지를 본다. 정렬 결과가 맞는지, 그리고 **입력 배열을 제자리에서 바꾼다는 것**.
 * 후자는 지금 loader 가 매 요청 새로 읽은 배열을 넘겨서 드러나지 않지만, 목록을 정적으로
 * 굽고 클라이언트에서 정렬하게 되면 같은 배열을 여러 번 정렬하게 된다. 그때 원본이 망가진다.
 */
import { describe, expect, it } from 'vitest';

import sortPosts from './sortPosts';
import { type IPost } from '../types/post';

type PostRow = Omit<IPost, 'body'>;

function post(createdAt: string, views?: number): PostRow {
  return { createdAt, views, plain_title: createdAt } as unknown as PostRow;
}

const OLD = '2024-01-01';
const MID = '2025-06-15';
const NEW = '2026-03-20';

describe('desc 는 최신 글을 앞에 둔다', () => {
  it('날짜 내림차순으로 정렬한다', () => {
    const rows = [post(OLD), post(NEW), post(MID)];

    expect(sortPosts(rows, 'desc').map((p) => p.createdAt)).toEqual([NEW, MID, OLD]);
  });

  it('알 수 없는 값이 오면 desc 로 본다', () => {
    const rows = [post(OLD), post(NEW)];

    expect(sortPosts(rows, 'unknown' as never).map((p) => p.createdAt)).toEqual([NEW, OLD]);
  });
});

describe('asc 는 오래된 글을 앞에 둔다', () => {
  it('날짜 오름차순으로 정렬한다', () => {
    const rows = [post(NEW), post(OLD), post(MID)];

    expect(sortPosts(rows, 'asc').map((p) => p.createdAt)).toEqual([OLD, MID, NEW]);
  });
});

describe('mostView 는 조회수가 많은 글을 앞에 둔다', () => {
  it('조회수 내림차순으로 정렬한다', () => {
    const rows = [post(OLD, 3), post(MID, 100), post(NEW, 20)];

    expect(sortPosts(rows, 'mostView').map((p) => p.views)).toEqual([100, 20, 3]);
  });

  it('조회수가 같으면 최신 글을 앞에 둔다', () => {
    const rows = [post(OLD, 10), post(NEW, 10), post(MID, 10)];

    expect(sortPosts(rows, 'mostView').map((p) => p.createdAt)).toEqual([NEW, MID, OLD]);
  });

  it('조회수가 없는 글은 0 으로 보고 뒤로 보낸다', () => {
    const rows = [post(NEW), post(OLD, 5)];

    expect(sortPosts(rows, 'mostView').map((p) => p.views)).toEqual([5, undefined]);
  });
});

describe('빈 목록과 한 건', () => {
  it.each([['desc'], ['asc'], ['mostView']])('%s 로 빈 배열을 넣어도 빈 배열이다', (orderBy) => {
    expect(sortPosts([], orderBy as never)).toEqual([]);
  });

  it('한 건이면 그대로 둔다', () => {
    expect(sortPosts([post(MID)], 'desc').map((p) => p.createdAt)).toEqual([MID]);
  });
});

describe('입력 배열을 제자리에서 바꾼다', () => {
  /**
   * 새 배열을 돌려주는 것이 아니라 받은 배열을 직접 정렬하고 그 배열을 그대로 돌려준다.
   * 부르는 쪽이 원본을 다시 쓸 생각이면 복사해서 넘겨야 한다.
   */
  it('돌려준 배열이 넣은 배열과 같은 객체다', () => {
    const rows = [post(OLD), post(NEW)];

    expect(sortPosts(rows, 'desc')).toBe(rows);
  });

  it('넣은 배열의 순서가 함께 바뀐다', () => {
    const rows = [post(OLD), post(NEW)];

    sortPosts(rows, 'desc');

    expect(rows.map((p) => p.createdAt)).toEqual([NEW, OLD]);
  });
});
