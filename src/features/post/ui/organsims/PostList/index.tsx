import { motion } from 'framer-motion';

import PostFilter from '../../molecules/PostFilter';

interface PostListProps extends GlobalAnimation {}

export default function PostList(props: PostListProps) {
  const { animation } = props;

  return (
    <div className="pt-10">
      <PostFilter animation={{ variants: animation?.variants }} />
      <motion.div variants={animation?.variants}>리스트 입니다</motion.div>
    </div>
  );
}
