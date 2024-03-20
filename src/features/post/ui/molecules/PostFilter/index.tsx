import { motion } from 'framer-motion';
import { useCallback } from 'react';

import {
  ORDER_BY_TO_POST_FILTER,
  POST_FILTER_TO_ORDER_BY,
  POST_SORT_FILTER,
} from '$features/post/constant';
import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import { PostsFilter, PostsOrderBy } from '$features/post/types/post';

import Dropdown from '$shared/ui/molecules/Dropdown';

interface PostFilterProps extends GlobalAnimation {}

export default function PostFilter(props: PostFilterProps) {
  const { animation } = props;
  const { searchParams, setSelectedParams } = useUrlParamsUpdater();

  const orderBy = (searchParams.get('orderby') as PostsOrderBy) || 'desc';
  const selectedFilter = ORDER_BY_TO_POST_FILTER[orderBy];

  const handleFilterRowClick = useCallback(
    (text: PostsFilter) => {
      setSelectedParams('orderby', POST_FILTER_TO_ORDER_BY[text], false);
    },
    [setSelectedParams],
  );

  return (
    <motion.div className="w-fit" variants={animation?.variants}>
      <Dropdown
        label={selectedFilter}
        items={POST_SORT_FILTER}
        handleSelect={handleFilterRowClick}
      />
    </motion.div>
  );
}
