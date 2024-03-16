import { motion } from 'framer-motion';

import CategoryChip from '$features/post/ui/atoms/CategoryChip';

import { CATEGORY_DATA } from '$shared/constant/category';

interface CategoriesProps extends GlobalAnimation {}

function Categories(props: CategoriesProps) {
  const { animation } = props;

  return (
    <motion.ul variants={animation?.variants} className="flex gap-2 flex-wrap">
      {CATEGORY_DATA.map((item, idx) => (
        <CategoryChip {...item} key={idx} />
      ))}
    </motion.ul>
  );
}

export default Categories;
