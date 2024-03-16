import { motion } from 'framer-motion';

import PostList from '$features/post/ui/organsims/PostList';
import Categories from '$features/post/ui/molecules/Categories';

import Input from '$shared/ui/molecules/Input';
import Title from '$shared/ui/atoms/Title';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '$shared/constant/animation';

export default function PostsPage() {
  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={FADE_IN_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <Title
        animation={{
          variants: FADE_IN_UP_ITEM,
        }}
        title="Post"
        subtitle="문제를 해결하며 얻은 경험들을 담은 공간입니다"
      />
      <Input
        placeholder="검색어를 입력하세요"
        animation={{ variants: FADE_IN_UP_ITEM }}
        inputType="search"
        className="my-4"
      />
      <Categories animation={{ variants: FADE_IN_UP_ITEM }} />
      <PostList animation={{ variants: FADE_IN_UP_ITEM }} />
    </motion.main>
  );
}
