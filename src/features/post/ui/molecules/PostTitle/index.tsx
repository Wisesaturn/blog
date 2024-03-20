/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { motion } from 'framer-motion';

import { IPost } from '$features/post/types/post';
import PostTitleInfo from '$features/post/ui/atoms/PostTitleInfo';

interface PostTitleProps extends GlobalAnimation, Omit<IPost, 'body'> {}

export default function PostTitle(props: PostTitleProps) {
  const { animation, description, createdAt, thumbnail, views, category, tags, title } = props;

  return (
    <>
      <motion.div
        className="pb-10 max-md:pb-5 rounded-3xl max-md:rounded-xl"
        variants={animation?.variants}
      >
        <img className="rounded-3xl max-md:rounded-xl" src={thumbnail} alt={title} />
      </motion.div>
      <motion.section
        className="pt-4 pb-2 mb-12 flex flex-col gap-4 max-md:gap-2 border-b-[1px]"
        variants={animation?.variants}
      >
        <span className="font-bold text-green-darker dark:text-green-brighter">{category}</span>
        <h1 className="text-4xl max-md:text-3xl">{title}</h1>
        <h2 className="text-xl max-md:text-base font-light">{description}</h2>
        <div className="flex justify-between items-end">
          <PostTitleInfo createdAt={createdAt} views={views} />
        </div>
      </motion.section>
    </>
  );
}
