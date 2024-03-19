import { motion } from 'framer-motion';

import PostList from '$features/post/ui/organsims/PostList';
import Categories from '$features/post/ui/molecules/Categories';
import useSelectedParams from '$features/post/hooks/useSelectedParams';

import Input from '$shared/ui/molecules/Input';
import Title from '$shared/ui/atoms/Title';
import { ANIMATE_FADE_UP_CONTAINER, ANIMATE_FADE_UP_ITEM } from '$shared/constant/animation';

export default function PostsPage() {
  const { searchParams, setSelectedParams } = useSelectedParams();

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={ANIMATE_FADE_UP_CONTAINER}
      className="layout min-h-screen"
    >
      <Title
        animation={{
          variants: ANIMATE_FADE_UP_ITEM,
        }}
        title="Post"
        subtitle="문제를 해결하며 얻은 경험들을 담은 공간입니다"
      />
      <Input
        placeholder="검색어를 입력하세요"
        animation={{ variants: ANIMATE_FADE_UP_ITEM }}
        initialValue={searchParams.get('search') || ''}
        handleEsc={() => setSelectedParams('search', '', false)}
        handleSearch={(_v) => setSelectedParams('search', _v, false)}
        inputType="search"
        className="my-4"
      />
      <Categories
        searchParams={searchParams}
        setSelectedParams={setSelectedParams}
        animation={{ variants: ANIMATE_FADE_UP_ITEM }}
      />
      <PostList animation={{ variants: ANIMATE_FADE_UP_ITEM }} />
    </motion.main>
  );
}
