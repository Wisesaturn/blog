import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';

import FilterRow from '$features/post/ui/atoms/FilterRow';
import { ORDER_BY_TO_POST_FILTER, POST_SORT_FILTER } from '$features/post/constant';
import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import { PostsOrderBy } from '$features/post/types/post';

interface PostFilterProps extends GlobalAnimation {}

export default function PostFilter(props: PostFilterProps) {
  const { animation } = props;
  const { searchParams } = useUrlParamsUpdater();
  const [opened, setOpened] = useState(false);

  const orderBy = (searchParams.get('orderby') as PostsOrderBy) || 'desc';
  const selectedFilter = ORDER_BY_TO_POST_FILTER[orderBy];

  const handleFilterClick = useCallback(() => {
    setOpened((prev) => !prev);
  }, []);

  const handleFilterRowClick = useCallback(() => {
    setOpened(false);
  }, []);

  return (
    <motion.div className="w-fit" variants={animation?.variants}>
      <button
        type="button"
        onClick={handleFilterClick}
        className="hover:cursor-pointer py-2 px-8 text-base border-[1px] shadow-sm w-fit rounded-md"
      >
        {selectedFilter}
      </button>
      {opened && (
        <div className="flex flex-col w-full items-start">
          {POST_SORT_FILTER.map((text, idx) => {
            const selected = selectedFilter === text;
            return (
              <FilterRow
                selected={selected}
                text={text}
                handleClick={handleFilterRowClick}
                key={idx}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
