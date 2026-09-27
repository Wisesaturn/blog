import { motion } from 'motion/react';
import { useCallback } from 'react';

import Dropdown from '@/commons/ui/Dropdown';

import {
  ORDER_BY_TO_POST_FILTER,
  POST_FILTER_TO_ORDER_BY,
  POST_SORT_FILTER,
  VIEW_SORT_FILTER,
} from '../config/sortOptions';
import useUrlParamsUpdater from '../model/useUrlParamsUpdater';
import parseOrderBy from '../model/parseOrderBy';
import { PostsFilter } from '../model/types';

interface PostFilterProps extends GlobalAnimation {
  /** 조회수를 받았는지. 받기 전에는 조회순을 고를 수 없고 그 자리에 스피너가 보인다 */
  viewsReady: boolean;
}

export default function PostFilter(props: PostFilterProps) {
  const { animation, viewsReady } = props;
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
        pendingItems={viewsReady ? [] : VIEW_SORT_FILTER}
      />
    </motion.div>
  );
}
