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

/**
 * @description 게시물 리스트를 받은 배열 그대로 정렬한다
 * @param posts 정렬할 글 목록. 제자리에서 바뀐다
 * @param orderBy 정렬 기준. 모르는 값이면 최신순으로 본다
 * @returns 정렬한 `posts` 자신
 */
export default function sortPosts(posts: PostRow[], orderBy: PostsOrderBy) {
  if (orderBy === 'asc') {
    posts.sort((a, b) => compareCreatedAt(a, b));
  } else if (orderBy === 'mostView') {
    posts.sort((a, b) => {
      const viewA = a.views || 0;
      const viewB = b.views || 0;
      if (viewA === viewB) return compareCreatedAt(b, a);
      return viewB - viewA;
    });
  } else {
    // default desc
    posts.sort((a, b) => compareCreatedAt(b, a));
  }

  return posts;
}
