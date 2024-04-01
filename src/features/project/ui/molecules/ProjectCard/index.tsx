import { motion } from 'framer-motion';

import { IProject } from '$features/project/types/project';

interface Props extends Omit<IProject, 'body'>, GlobalAnimation {}

export default function ProjectCard(props: Props) {
  const { skills, theme, views, date, title, thumbnail, description, animation } = props;
  return (
    <motion.div
      variants={animation?.variants}
      className="layout-hover layout-border layout-bg layout-text layout-rounded"
    >
      <div className="w-full h-[200px] layout-rounded">
        <img
          className="rounded-t-md max-md:rounded-t-sm w-full h-full object-cover"
          src={thumbnail}
          alt={`${title} thumbnail`}
        />
      </div>
      <div className="p-4">
        <h3>{title}</h3>
        <h4 className="font-normal text-base">{theme}</h4>
        <div>
          <div>
            <span>{date.start}</span>
            <span>~</span>
            <span>{date.end}</span>
          </div>
        </div>
        <div className="flex gap-1 flex-wrap">
          {skills.map((skill, idx) => (
            <div className="text-base" key={`${title}-${idx}`}>
              {skill}
            </div>
          ))}
        </div>
        <span>{views}</span>
      </div>
    </motion.div>
  );
}
