import { type IPost } from '@/entities/post';

import parseCreatedAt from './parseCreatedAt';
import { type PostsOrderBy } from '../model/types';

type PostRow = Omit<IPost, 'body'>;

/**
 * @description 두 글의 작성일 차이. 앞 글이 더 최근이면 양수다
 * @param a 앞 글
 * @param b 뒤 글
 * @returns 밀리초 단위 차이
 */
function compareCreatedAt(a: PostRow, b: PostRow): number {
  return parseCreatedAt(a.createdAt).getTime() - parseCreatedAt(b.createdAt).getTime();
}

/** 글 하나의 조회수를 돌려준다. 목록 통계(`GET /api/stats/post`)에서 찾는다 */
export type ViewsOf = (post: PostRow) => number;

/**
 * @description 게시물 리스트를 받은 배열 그대로 정렬한다
 *
 * 조회수는 목록 행에 없고 통계 API 로 따로 받는다 (#119). 그래서 조회순은 `viewsOf` 가 있을 때만 하고,
 * 통계를 받기 전(`viewsOf` 가 없을 때)에는 최신순으로 둔다. 받으면 다시 불러 조회순으로 바꾼다.
 * @param posts 정렬할 글 목록. 제자리에서 바뀐다
 * @param orderBy 정렬 기준. 모르는 값이면 최신순으로 본다
 * @param viewsOf 글의 조회수를 찾는 함수. 없으면 조회순을 최신순으로 대신한다
 * @returns 정렬한 `posts` 자신
 */
export default function sortPosts(posts: PostRow[], orderBy: PostsOrderBy, viewsOf?: ViewsOf) {
  if (orderBy === 'asc') {
    posts.sort((a, b) => compareCreatedAt(a, b));
  } else if (orderBy === 'mostView' && viewsOf) {
    posts.sort((a, b) => {
      const viewA = viewsOf(a);
      const viewB = viewsOf(b);
      if (viewA === viewB) return compareCreatedAt(b, a);
      return viewB - viewA;
    });
  } else {
    // default desc
    posts.sort((a, b) => compareCreatedAt(b, a));
  }

  return posts;
}
