import { motion } from 'motion/react';
import { Link } from 'react-router';

import Badge from '@/commons/ui/Badge';
import Icons from '@/commons/ui/icons/Icons';
import StatCount from '@/commons/ui/StatCount';

import { ISnippet } from '../api/types';

interface Props extends Omit<ISnippet, 'body'>, GlobalAnimation {
  /** 목록 통계에서 받은 조회수. 받는 중이면 `undefined`, 받지 못하면 `null` */
  views: number | null | undefined;
  /** 목록 통계에서 받은 좋아요 수. `views` 와 같은 규칙이다 */
  likes: number | null | undefined;
}

export default function SnippetCard(props: Props) {
  const { skills, views, likes, title, description, animation } = props;
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
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Icons.View className="icons-size-small pr-1" />
                <StatCount value={views} label="조회수" />
              </div>
              <div className="flex items-center gap-1">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-3.5 text-(--green-main)"
                  fill="currentColor"
                >
                  <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.7 4.5c2.1 0 3.6 1.1 4.4 2.5.2.3.6.3.8 0 .8-1.4 2.3-2.5 4.4-2.5 3.8 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" />
                </svg>
                <StatCount value={likes} label="좋아요" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
