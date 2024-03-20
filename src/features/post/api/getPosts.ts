import { collection, query, getDocs, where } from 'firebase/firestore';

import { IPost } from '$features/post/types/post';

import { db } from '$shared/middleware/firebase';
import { CATEGORY_DATA } from '$shared/constant/category';

interface GetPostsProps {
  keyword: string;
  categories: string[];
}

export default async function getPosts(props: GetPostsProps) {
  const { keyword, categories } = props;

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
          )
        : query(collection(db, category.link));

      const querySnapshot = await getDocs(q);
      const post = querySnapshot.docs.map((doc) => doc.data());

      return { data: post };
    }),
  );

  const posts = originPosts.reduce((acc, cur) => {
    acc.data.push(...cur.data);

    return acc;
  });

  return posts.data as IPost[];
}
