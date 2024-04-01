import { motion } from 'framer-motion';

import ArticleShareButton from '../../atoms/ArticleShareButton';
import ArticleListButton from '../../atoms/ArticleListButton';

export default function ArticleButtons({ animation }: GlobalAnimation) {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 w-full py-10"
      variants={animation?.variants}
    >
      <ArticleShareButton />
      <ArticleListButton />
    </motion.div>
  );
}
