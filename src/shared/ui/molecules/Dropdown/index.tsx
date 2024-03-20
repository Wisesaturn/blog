import { useCallback, useState } from 'react';

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
    <div className="w-fit min-w-[10rem] text-left flex flex-col gap-1">
      <button
        className="w-full border-[1px] py-2 rounded-md text-base"
        type="button"
        onClick={handleLabelClick}
      >
        {selectedItem}
      </button>
      {opened && (
        <div className="flex min-w-[10rem] flex-col gap-1 rounded-md border-[1px]">
          {items.map((item, index) => {
            const commonClass = `py-2 text-base`;
            const selectedClass = `${selectedItem === item ? 'bg-gray-100 text-black' : 't'}`;
            return (
              <button
                className={`${commonClass} ${selectedClass}`}
                type="button"
                onClick={() => handleItemClick(item)}
                key={index}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
