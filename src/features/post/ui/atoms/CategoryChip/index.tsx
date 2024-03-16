import { ICategory } from '$shared/constant/category';

interface CategoryChipProps extends ICategory {
  selected?: boolean;
}

export default function CategoryChip(props: CategoryChipProps) {
  const { link, name, selected } = props;

  const selectedClass = `${selected ? 'text-white dark:text-black bg-green-darker dark:bg-green-brighter' : 'text-green-darker dark:text-green-brighter'}`;
  const categoryClass = `border-green-darker hover:cursor-pointer px-5 py-1.5 border-[1px] rounded-md text-base max-md:text-sm font-light ${selectedClass}`;

  return <li className={categoryClass}>{name}</li>;
}
