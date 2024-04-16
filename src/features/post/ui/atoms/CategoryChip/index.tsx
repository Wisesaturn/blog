import { ICategory } from '$shared/constant/category';

interface CategoryChipProps extends ICategory {
  selected?: boolean;
  handleClick: () => void;
}

export default function CategoryChip(props: CategoryChipProps) {
  const { name, selected, handleClick } = props;

  const selectedClass = `${selected ? 'text-white bg-green-main hover:bg-green-darker dark:hover:bg-green-dark dark:border-green-brighter dark:bg-green-darker' : 'hover:dark:bg-[#1a1a1a] hover:bg-gray-100 text-green-darker dark:text-green-brighter bg-white dark:bg-transparent'}`;
  const categoryClass = `border-green-darker transition-color duration-200 hover:cursor-pointer px-5 py-1.5 border-[1px] rounded-md text-base max-md:text-sm font-light ${selectedClass}`;

  return (
    <button type="button" onClick={handleClick} className={categoryClass}>
      {name}
    </button>
  );
}
