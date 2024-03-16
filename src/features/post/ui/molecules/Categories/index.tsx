import { motion } from 'framer-motion';

interface CategoriesProps extends GlobalAnimation {}

export default function Categories(props: CategoriesProps) {
  const { animation } = props;

  return <motion.div variants={animation?.variants}>카테고리입니다</motion.div>;
}
