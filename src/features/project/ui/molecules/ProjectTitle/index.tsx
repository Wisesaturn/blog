/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { motion } from 'framer-motion';

import { IProject } from '$features/project/types/project';

import ProjectTitleInfo from '../../atoms/ProjectTitleInfo';
import ProjectTitleLink from '../../atoms/ProjectTitleLink';

interface ProjectTitleProps extends GlobalAnimation, Omit<IProject, 'body'> {}

export default function ProjectTitle(props: ProjectTitleProps) {
  const {
    github,
    website,
    animation,
    date,
    description,
    theme,
    thumbnail,
    views,
    category,
    title,
  } = props;

  return (
    <>
      <motion.div
        className="pb-4 max-md:pb-0 w-full h-[500px] max-md:h-[250px] rounded-3xl max-md:rounded-xl skeleton"
        variants={animation?.variants}
      >
        <img
          fetchPriority="high"
          decoding="async"
          className="rounded-3xl object-cover h-[500px] max-md:h-[250px] w-full max-md:rounded-xl"
          src={thumbnail}
          alt={title}
        />
      </motion.div>
      <motion.section
        id="article-title"
        className="pt-4 pb-2 flex flex-col gap-2 max-md:gap-1 border-b-[1px]"
        variants={animation?.variants}
      >
        <span className="font-bold text-base max-md:text-sm text-green-darker dark:text-green-brighter">
          {category.toLocaleUpperCase()}
        </span>
        <div className="md:space-y-1">
          <h1 className="text-4xl max-md:text-2xl">{title}</h1>
          <h2 className="font-semibold text-2xl max-md:text-lg">{theme}</h2>
        </div>
        <h3 className="text-xl max-md:text-base font-light py-2">{description}</h3>
        <div className="flex justify-between items-center max-md:items-start max-md:gap-1 max-md:flex-col-reverse">
          <ProjectTitleInfo date={date} views={views} />
          <ProjectTitleLink github={github} website={website} />
        </div>
      </motion.section>
    </>
  );
}
