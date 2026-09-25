import { motion } from 'motion/react';
import { Link } from 'react-router';

import Badge from '@/commons/ui/Badge';
import Icons from '@/commons/ui/icons';

import { ISnippet } from '../api/types';

interface Props extends Omit<ISnippet, 'body'>, GlobalAnimation {}

export default function SnippetCard(props: Props) {
  const { skills, views, title, description, animation } = props;
  return (
    <Link to={title}>
      <motion.div
        variants={animation?.variants}
        className="layout-hover layout-border layout-bg layout-text layout-rounded"
      >
        <div className="p-4 flex gap-1 flex-col">
          <h3>{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
          <div className="flex justify-between pt-1 w-full">
            <div className="flex gap-1 flex-wrap">
              {skills.map((skill, idx) => (
                <div className="text-base [&>:not(:first-child)]:ml-1" key={`${title}-${idx}`}>
                  <Badge>{skill}</Badge>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <Icons.View className="icons-size-small pr-1" />
              {views || 0}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
