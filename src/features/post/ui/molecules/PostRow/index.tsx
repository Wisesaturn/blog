import { Link } from 'react-router';

import { IPost } from '$features/post/types/post';

import Icons from '$shared/ui/atoms/icons';
import convertString from '$shared/lib/convertString';

export default function PostRow(props: Omit<IPost, 'body'>) {
  // Firestore 문서의 필드명이 plain_title 이라 구조분해에서 이름을 바꿔 받는다
  const { createdAt, title, description, category, views, plain_title: plainTitle } = props;

  if (typeof plainTitle !== 'string') return null;
  const convertTitle = convertString(plainTitle, 'spaceToDash');

  return (
    <Link
      to={`${category}/${convertTitle}`}
      className="flex flex-col gap-1 p-4 border-[1px] layout-all dark:hover:shadow-md"
    >
      <h3>{title}</h3>
      <div className="flex gap-2">
        <span className="text-green-dark pr-2 border-green-dark border-r-[1px] dark:text-green-brighter">
          {category.toLocaleUpperCase()}
        </span>
        <span className="whitespace-nowrap">{createdAt}</span>
      </div>
      <div className="pt-4 gap-4 flex justify-between items-end text-gray-600 dark:text-gray-300">
        <h3 className="layout-text">{description}</h3>
        <div className="flex items-center gap-1">
          <Icons.View size="small" className="icons-size-small pr-1" />
          {views || 0}
        </div>
      </div>
    </Link>
  );
}
