import { motion } from 'framer-motion';

import Badge from '$shared/ui/atoms/Badge';

interface ArticleTagsProps extends GlobalAnimation {
  tags: string[];
}

export default function ArticleTags(props: ArticleTagsProps) {
  const { animation, tags } = props;

  return (
    <motion.div className="block max-md:gap-3 pt-8 items-start" variants={animation?.variants}>
      <div className="flex gap-2 flex-wrap break-keep">
        {tags.map((tag, idx) => (
          <Badge key={idx}>{`#${tag}`}</Badge>
        ))}
      </div>
    </motion.div>
  );
}
