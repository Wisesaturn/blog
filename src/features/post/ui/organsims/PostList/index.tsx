import { motion } from 'framer-motion';

interface PostListProps extends GlobalAnimation {}

export default function PostList(props: PostListProps) {
  const { animation } = props;

  return <motion.div variants={animation?.variants}>리스트입니다</motion.div>;
}
