/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { motion } from 'framer-motion';

import { ISnippet } from '$features/snippet/types/snippet';

interface SnippetTitleProps extends GlobalAnimation, Omit<ISnippet, 'body'> {}

export default function SnippetTitle(props: SnippetTitleProps) {
  const { animation, description, views, skills, title } = props;

  return (
    <>
      <motion.section
        id="article-title"
        className="pt-4 pb-2 flex flex-col gap-4 max-md:gap-2 border-b-[1px]"
        variants={animation?.variants}
      >
        <h1 className="text-4xl max-md:text-3xl">{title}</h1>
        <h3 className="text-xl max-md:text-base font-light">{description}</h3>
      </motion.section>
    </>
  );
}
