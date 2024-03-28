import { Link } from '@remix-run/react';

import { IPost } from '$features/post/types/post';

import Icons from '$shared/ui/atoms/icons';
import convertString from '$shared/lib/convertString';

export default function PostRow(props: IPost) {
  // eslint-disable-next-line camelcase, @typescript-eslint/naming-convention
  const { createdAt, title, description, category, views, plain_title } = props;

  const convertTitle = convertString(plain_title, 'spaceToDash');

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
      <div className="pt-4 gap-4 flex justify-between items-end">
        <h3 className="layout-text text-gray-500 dark:text-gray-300">{description}</h3>
        <div className="flex items-center gap-2 dark:text-gray-300">
          <Icons.View size="small" className="fill-gray-500 icons-size-small" />
          {views || 0}
        </div>
      </div>
    </Link>
  );
}
