import { motion } from 'motion/react';
import { useCallback } from 'react';

import {
  ORDER_BY_TO_POST_FILTER,
  POST_FILTER_TO_ORDER_BY,
  POST_SORT_FILTER,
} from '@/features/post/constant';
import useUrlParamsUpdater from '@/features/post/hooks/useUrlParamsUpdater';
import parseOrderBy from '@/features/post/model/parseOrderBy';
import { PostsFilter } from '@/features/post/types/postsQuery';

import Dropdown from '@/commons/ui/Dropdown';

interface PostFilterProps extends GlobalAnimation {}

export default function PostFilter(props: PostFilterProps) {
  const { animation } = props;
  const { searchParams, setSelectedParams } = useUrlParamsUpdater();

  const orderBy = parseOrderBy(searchParams.get('orderby'));
  const selectedFilter = ORDER_BY_TO_POST_FILTER[orderBy];

  const handleFilterRowClick = useCallback(
    (text: PostsFilter) => {
      setSelectedParams('orderby', POST_FILTER_TO_ORDER_BY[text], false);
    },
    [setSelectedParams],
  );

  return (
    <motion.div
      className="w-full absolute z-10 flex justify-between"
      variants={animation?.variants}
    >
      <Dropdown
        label={selectedFilter}
        items={POST_SORT_FILTER}
        handleSelect={handleFilterRowClick}
      />
    </motion.div>
  );
}
