import { motion } from 'framer-motion';

import useSelectedParams from '$features/post/hooks/useSelectedParams';
import CategoryChip from '$features/post/ui/atoms/CategoryChip';

import { CATEGORY_DATA } from '$shared/constant/category';

interface CategoriesProps extends GlobalAnimation, ReturnType<typeof useSelectedParams> {}

function Categories(props: CategoriesProps) {
  const { animation, searchParams, setSelectedParams } = props;

  return (
    <motion.div variants={animation?.variants} className="flex gap-2 flex-wrap">
      {CATEGORY_DATA.map((item, idx) => {
        const keyParams = searchParams.get('category') || '';
        const selected = keyParams.includes(item.link);
        return (
          <CategoryChip
            handleClick={() => setSelectedParams('category', item.link)}
            selected={selected}
            {...item}
            key={idx}
          />
        );
      })}
    </motion.div>
  );
}

export default Categories;
