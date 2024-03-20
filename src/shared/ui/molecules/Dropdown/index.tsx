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
    <div className="w-fit min-w-[10rem] max-md:min-w-[8rem] text-left flex flex-col gap-1 text-base max-md:text-xs font-light">
      <div
        role="presentation"
        className="flex justify-between items-center w-full bg-white dark:bg-black hover:bg-gray-50 hover:dark:bg-[#1a1a1a] border-[1px] hover:cursor-pointer py-2 max-md:py-1.5 rounded-md max-md:rounded-sm px-2.5 max-md:px-2"
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
        <div className="flex flex-col w-full hover:cursor-pointer rounded-md max-md:rounded-sm border-[1px]">
          {items.map((item, index) => {
            const commonClass = `bg-white dark:bg-black py-2 max-md:py-1.5 pl-4 max-md:pl-2`;
            const selectedClass = `${selectedItem === item ? 'bg-green-bright text-black dark:bg-green-dark dark:text-white' : 'hover:bg-gray-50 hover:dark:bg-[#1a1a1a]'}`;
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
