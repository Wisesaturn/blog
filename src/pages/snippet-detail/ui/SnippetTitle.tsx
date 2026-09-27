import { motion } from 'motion/react';
import { type ReactNode } from 'react';

import { ISnippet } from '@/entities/snippet';

import Icons from '@/commons/ui/icons/Icons';
import StatCount from '@/commons/ui/StatCount';
import Badge from '@/commons/ui/Badge';

interface SnippetTitleProps extends GlobalAnimation, Omit<ISnippet, 'body' | 'views'> {
  views: number | null | undefined;
  /** 정보 줄에서 조회수 바로 옆에 두는 좋아요 버튼 (#120) */
  likeSlot?: ReactNode;
}

export default function SnippetTitle(props: SnippetTitleProps) {
  const { animation, description, views, skills, title, likeSlot } = props;

  return (
    <>
      <motion.section
        id="article-title"
        className="pt-4 pb-2 flex flex-col gap-2 max-md:gap-1 border-b"
        variants={animation?.variants}
      >
        <h1 className="text-4xl max-md:text-2xl">{title}</h1>
        <p className="text-xl max-md:text-base font-light">{description}</p>
        <div className="flex items-center gap-4 pt-2">
          <div className="flex gap-1 items-center align-middle text-gray-600 dark:text-gray-300">
            <Icons.View className="icons-size-small pr-1" />
            <StatCount value={views} label="조회수" />
          </div>
          {likeSlot}
        </div>
      </motion.section>
    </>
  );
}
