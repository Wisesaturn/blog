import { useCallback, useState } from 'react';

import Icons from '$shared/ui/atoms/icons';

interface DropdownProps<T extends string | number> {
  label: T;
  items: T[];
  handleSelect?: (_v: T) => void;
}

export default function Dropdown<T extends string | number>(props: DropdownProps<T>) {
  const { items, handleSelect } = props;
  const [opened, setOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T>(items[0]);

  const handleLabelClick = useCallback(() => {
    setOpened((prev) => !prev);
  }, []);

  const handleItemClick = (item: T) => {
    if (handleSelect) {
      handleSelect(item);
    }
    setOpened(false);
    setSelectedItem(item);
  };

  return (
    <div className="w-fit min-w-[10rem] max-md:min-w-[8rem] text-left flex flex-col gap-1 layout-text layout-text-color">
      <div
        role="presentation"
        className="flex justify-between items-center w-full layout-bg hover:bg-gray-50 hover:dark:bg-[#1a1a1a] layout-border hover:cursor-pointer py-2 px-4 max-md:px-2 layout-rounded"
        onKeyDown={handleLabelClick}
        onClick={handleLabelClick}
      >
        <div>{selectedItem}</div>
        <Icons.ArrowDown
          type="none"
          className="w-[20px] h-[20px] max-md:w-[16px] max-md:h-[16px] fill-black"
        />
      </div>
      {opened && (
        <div className="shadow-lg dark:shadow-2xl flex flex-col w-full hover:cursor-pointer layout-rounded layout-border">
          {items.map((item, index) => {
            const commonClass = `layout-bg py-2 pl-4 max-md:pl-2 dark:border-gray-600`;
            const selectedClass = `${selectedItem === item ? 'bg-green-bright dark:bg-green-dark' : 'hover:bg-gray-50 hover:dark:bg-[#1a1a1a]'}`;
            const borderClass = `${index !== 0 ? 'border-t-[1px]' : 'max-md:rounded-t-sm rounded-t-md'} ${index === items.length - 1 ? 'max-md:rounded-b-sm rounded-b-md' : ''}`;
            return (
              <div
                className={`${commonClass} ${selectedClass} ${borderClass}`}
                role="presentation"
                onClick={() => handleItemClick(item)}
                onKeyDown={() => handleItemClick(item)}
                key={index}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
