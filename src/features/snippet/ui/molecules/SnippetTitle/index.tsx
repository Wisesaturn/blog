/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { motion } from 'framer-motion';

import { ISnippet } from '$features/snippet/types/snippet';

import Icons from '$shared/ui/atoms/icons';
import Badge from '$shared/ui/atoms/Badge';

interface SnippetTitleProps extends GlobalAnimation, Omit<ISnippet, 'body'> {}

export default function SnippetTitle(props: SnippetTitleProps) {
  const { animation, description, views, skills, title } = props;

  return (
    <>
      <motion.section
        id="article-title"
        className="pt-4 pb-2 flex flex-col gap-2 max-md:gap-1 border-b-[1px]"
        variants={animation?.variants}
      >
        <h1 className="text-4xl max-md:text-2xl">{title}</h1>
        <h3 className="text-xl max-md:text-base font-light">{description}</h3>
        <div className="flex gap-1 items-center align-middle pt-2 text-gray-600 dark:text-gray-300">
          <Icons.View className="icons-size-small pr-1" />
          <p className="layout-text">{views}</p>
        </div>
      </motion.section>
    </>
  );
}
