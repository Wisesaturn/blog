import { motion } from 'framer-motion';

import SnippetShareButton from '../../atoms/SnippetShareButton';
import SnippetListButton from '../../atoms/SnippetListButton';

export default function SnippetButtons({ animation }: GlobalAnimation) {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 w-full py-10"
      variants={animation?.variants}
    >
      <SnippetShareButton />
      <SnippetListButton />
    </motion.div>
  );
}
