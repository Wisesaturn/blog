import { motion } from 'framer-motion';
import { Link } from '@remix-run/react';

import { IProject } from '$features/project/types/project';

import Badge from '$shared/ui/atoms/Badge';
import Icons from '$shared/ui/atoms/icons';

interface Props extends Omit<IProject, 'body'>, GlobalAnimation {}

export default function ProjectCard(props: Props) {
  const { skills, theme, views, date, title, thumbnail, animation } = props;
  return (
    <Link to={title}>
      <motion.div
        variants={animation?.variants}
        className="layout-hover h-full layout-border layout-bg layout-text layout-rounded"
      >
        <div className="w-full h-[200px] layout-rounded">
          <img
            className="rounded-t-md max-md:rounded-t-sm w-full h-full object-cover"
            src={thumbnail}
            alt={`${title} thumbnail`}
          />
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-1">
            <h3>{title}</h3>
            <h4 className="font-normal text-base text-gray-600 dark:text-gray-300">{theme}</h4>
            <div className="flex gap-1 flex-wrap pt-1">
              {skills.map((skill, idx) => (
                <Badge key={`${skill}-${idx}`}>{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
