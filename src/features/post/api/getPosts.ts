import { collection, getDocs, query, where } from 'firebase/firestore';

import { IPost, PostsOrderBy } from '$features/post/types/post';

import { CATEGORY_DATA } from '$shared/constant/category';
import { db } from '$shared/middleware/firebase';

import sortPosts from '../lib/sortPosts';

interface Props {
  keyword: string;
  categories: string[];
  orderBy?: PostsOrderBy;
}

export default async function getPosts(props: Props) {
  const { keyword, categories, orderBy } = props;

  let SEARCH_CATEGORY = CATEGORY_DATA;

  if (categories.length > 0) {
    SEARCH_CATEGORY = CATEGORY_DATA.filter((c) => categories.includes(c.link));
  }

  const originPosts = await Promise.all(
    SEARCH_CATEGORY.map(async (category) => {
      // search가 문자열 앞부터 가능함 (Like 구문 없음)
      // TODO : 추후에 LIKE처럼 Search 되도록 수정해야 함
      const q = keyword
        ? query(
            collection(db, category.link),
            where('plain_title', '>=', keyword),
            where('plain_title', '<=', `${keyword}\uf8ff`),
            // TODO : 추후에 모든 게시물 tag가 바뀌면 추가
            // where('tags', 'array-contains', keyword),
          )
        : query(collection(db, category.link));

      const querySnapshot = await getDocs(q);
      const post = querySnapshot.docs.map((doc) => doc.data());
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const excludedBodyPost = post.map(({ body, ...doc }) => doc);

      return { data: excludedBodyPost };
    }),
  );

  const posts = originPosts.reduce((acc, cur) => {
    acc.data.push(...cur.data);

    return acc;
  });

  // sorting
  if (orderBy) {
    const sortedPosts = sortPosts(posts.data as IPost[], orderBy);
    return sortedPosts;
  }

  return posts.data as IPost[];
}
