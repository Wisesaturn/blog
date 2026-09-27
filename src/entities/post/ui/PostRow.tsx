import { Link } from 'react-router';

import Icons from '@/commons/ui/icons/Icons';
import StatCount from '@/commons/ui/StatCount';
import convertString from '@/commons/lib/convertString';

import { IPost } from '../api/types';

interface PostRowProps extends Omit<IPost, 'body'> {
  /** 목록 통계에서 받은 조회수. 받는 중이면 `undefined`, 받지 못하면 `null` */
  views: number | null | undefined;
  /** 목록 통계에서 받은 좋아요 수. `views` 와 같은 규칙이다 */
  likes: number | null | undefined;
}

export default function PostRow(props: PostRowProps) {
  // Firestore 문서의 필드명이 plain_title 이라 구조분해에서 이름을 바꿔 받는다
  const { createdAt, title, description, category, views, likes, plain_title: plainTitle } = props;

  if (typeof plainTitle !== 'string') return null;
  const convertTitle = convertString(plainTitle, 'spaceToDash');

  return (
    <Link
      to={`${category}/${convertTitle}`}
      className="flex flex-col gap-1 p-4 border layout-all dark:hover:shadow-md"
    >
      <h3>{title}</h3>
      <div className="flex gap-2">
        <span className="text-green-dark pr-2 border-green-dark border-r dark:text-green-brighter">
          {category.toLocaleUpperCase()}
        </span>
        <span className="whitespace-nowrap">{createdAt}</span>
      </div>
      <div className="pt-4 gap-4 flex justify-between items-end text-gray-600 dark:text-gray-300">
        <h3 className="layout-text">{description}</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Icons.View size="small" className="icons-size-small pr-1" />
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
    </Link>
  );
}
