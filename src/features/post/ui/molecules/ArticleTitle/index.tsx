/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { motion } from 'framer-motion';

import { IPost } from '$features/post/types/post';
import ArticleTitleInfo from '$features/post/ui/atoms/ArticleTitleInfo';

interface ArticleTitleProps extends GlobalAnimation, Omit<IPost, 'body' | 'tags'> {}

export default function ArticleTitle(props: ArticleTitleProps) {
  const { animation, description, createdAt, thumbnail, views, category, title } = props;

  return (
    <>
      <motion.div
        className="pb-8 max-md:pb-5 w-full h-[500px] rounded-3xl max-md:rounded-xl"
        variants={animation?.variants}
      >
        <img
          loading="eager"
          className="rounded-3xl object-cover h-full w-full max-md:rounded-xl"
          src={thumbnail}
          alt={title}
        />
      </motion.div>
      <motion.section
        id="article-title"
        className="pt-4 pb-2 flex flex-col gap-4 max-md:gap-2 border-b-[1px]"
        variants={animation?.variants}
      >
        <span className="font-bold text-base max-md:text-sm text-green-darker dark:text-green-brighter">
          {category.toLocaleUpperCase()}
        </span>
        <h1 className="text-4xl max-md:text-3xl">{title}</h1>
        <h2 className="text-xl max-md:text-base font-light">{description}</h2>
        <div className="flex justify-between items-end">
          <ArticleTitleInfo createdAt={createdAt} views={views} />
        </div>
      </motion.section>
    </>
  );
}
