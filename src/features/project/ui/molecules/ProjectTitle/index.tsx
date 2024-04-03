/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { motion } from 'framer-motion';

import { IProject } from '$features/project/types/project';

import ProjectTitleInfo from '../../atoms/ProjectTitleInfo';

interface ProjectTitleProps extends GlobalAnimation, Omit<IProject, 'body'> {}

export default function ProjectTitle(props: ProjectTitleProps) {
  const { animation, date, description, theme, thumbnail, views, category, title } = props;

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
        <h2 className="text-2xl max-md:text-xl">{theme}</h2>
        <h3 className="text-xl max-md:text-base font-light">{description}</h3>
        <div className="flex justify-between items-end">
          <ProjectTitleInfo date={date} views={views} />
        </div>
      </motion.section>
    </>
  );
}
