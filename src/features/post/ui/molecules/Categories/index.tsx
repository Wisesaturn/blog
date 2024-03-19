import { motion } from 'framer-motion';
import { useSearchParams } from '@remix-run/react';
import { useCallback, useState } from 'react';

import CategoryChip from '$features/post/ui/atoms/CategoryChip';

import { CATEGORY_DATA } from '$shared/constant/category';

interface CategoriesProps extends GlobalAnimation {}

function Categories(props: CategoriesProps) {
  const { animation } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleClickChip = useCallback(
    (link: string) => {
      const isSelected = selectedCategories.includes(link);
      const updatedCategories = isSelected
        ? selectedCategories.filter((category) => category !== link)
        : selectedCategories.concat(link);

      setSelectedCategories(updatedCategories);
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', updatedCategories.toString());
      setSearchParams(params, {
        preventScrollReset: true,
      });
    },
    [searchParams, selectedCategories, setSearchParams],
  );

  return (
    <motion.div variants={animation?.variants} className="flex gap-2 flex-wrap">
      {CATEGORY_DATA.map((item, idx) => {
        const selected = selectedCategories.includes(item.link);
        return (
          <CategoryChip
            handleClick={() => handleClickChip(item.link)}
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
