import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';

import FilterRow from '$features/post/ui/atoms/FilterRow';
import { POST_SORT_FILTER } from '$features/post/constant';

interface PostFilterProps extends GlobalAnimation {}

export default function PostFilter(props: PostFilterProps) {
  const { animation } = props;
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => {
    setClicked((prev) => !prev);
  }, []);

  return (
    <motion.div className="w-fit" variants={animation?.variants}>
      <button
        type="button"
        onClick={handleClick}
        className="hover:cursor-pointer py-2.5 px-4 border-[1px] shadow-sm w-fit rounded-md max-md:rounded-sm"
      >
        Post filter
      </button>
      {clicked && (
        <div className="flex flex-col w-full items-start">
          {POST_SORT_FILTER.map((text, idx) => (
            <FilterRow text={text} key={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
