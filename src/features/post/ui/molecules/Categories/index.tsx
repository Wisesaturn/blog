import { motion } from 'framer-motion';

import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import CategoryChip from '$features/post/ui/atoms/CategoryChip';

import { CATEGORY_DATA } from '$shared/constant/category';

interface CategoriesProps extends GlobalAnimation {}

function Categories(props: CategoriesProps) {
  const { animation } = props;
  const { searchParams, setSelectedParams } = useUrlParamsUpdater();

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
