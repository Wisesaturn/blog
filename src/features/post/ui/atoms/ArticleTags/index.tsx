import { motion } from 'framer-motion';

import { ITag } from '$features/post/types/article';

import Badge from '$shared/ui/atoms/Badge';

interface ArticleTagsProps extends GlobalAnimation {
  tags: ITag[];
}

export default function ArticleTags(props: ArticleTagsProps) {
  const { animation, tags } = props;

  return (
    <motion.div className="flex gap-5 max-md:gap-3 pt-8 items-start" variants={animation?.variants}>
      <p className="layout-text">tags</p>
      <div className="flex gap-2 flex-wrap break-keep">
        {tags.map((tag, idx) => (
          <Badge key={idx}>{`#${tag.name}`}</Badge>
        ))}
      </div>
    </motion.div>
  );
}
