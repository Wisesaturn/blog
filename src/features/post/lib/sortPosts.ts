import { DocumentData } from 'firebase/firestore';

import { IPost, PostsOrderBy } from '../types/post';

/**
 * @summary 게시물 리스트를 정렬하는 함수
 * @param posts
 * @param orderBy
 * @returns
 */
export default function sortPosts(posts: IPost[], orderBy: PostsOrderBy) {
  if (orderBy === 'asc') {
    posts.sort((a: DocumentData, b: DocumentData) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA < dateB ? -1 : 1;
    });
  } else if (orderBy === 'mostView') {
    posts.sort((a: DocumentData, b: DocumentData) => {
      const viewA = a.views || 0;
      const viewB = b.views || 0;
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (viewA === viewB) {
        return dateA < dateB ? 1 : -1;
      }
      return viewA < viewB ? 1 : -1;
    });
  } else {
    // default desc
    posts.sort((a: DocumentData, b: DocumentData) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA < dateB ? 1 : -1;
    });
  }

  return posts;
}
