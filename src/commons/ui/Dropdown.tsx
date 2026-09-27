import { useCallback, useState } from 'react';

import Icons from './icons/Icons';

interface DropdownProps<T extends string | number> {
  label: T;
  items: readonly T[];
  handleSelect?: (_v: T) => void;
  /** 아직 고를 수 없는 항목. 목록에서 이름 대신 작은 스피너를 보여 주고 누를 수 없다 */
  pendingItems?: readonly T[];
}

export default function Dropdown<T extends string | number>(props: DropdownProps<T>) {
  const { label: selectedItem, items, handleSelect, pendingItems = [] } = props;
  const [opened, setOpened] = useState(false);

  const handleLabelClick = useCallback(() => {
    setOpened((prev) => !prev);
  }, []);

  const handleItemClick = (item: T) => {
    if (handleSelect) {
      handleSelect(item);
    }
    setOpened(false);
  };

  return (
    <div className="w-fit min-w-40 max-md:min-w-32 text-left flex flex-col gap-1 layout-text layout-text-color">
      <div
        role="presentation"
        className="flex justify-between items-center w-full layout-bg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] layout-border hover:cursor-pointer py-2 px-4 max-md:px-2 layout-rounded"
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
            const selectedClass = `${selectedItem === item ? 'bg-green-bright dark:bg-green-dark' : 'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'}`;
            const borderClass = `${index !== 0 ? 'border-t' : 'max-md:rounded-t-xs rounded-t-md'} ${index === items.length - 1 ? 'max-md:rounded-b-xs rounded-b-md' : ''}`;
            if (pendingItems.includes(item)) {
              return (
                <div
                  className={`${commonClass} ${borderClass} flex items-center cursor-default`}
                  role="status"
                  aria-label={`${item} 준비 중`}
                  key={index}
                >
                  <span
                    aria-hidden
                    className="inline-block size-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-green-main dark:border-gray-600 dark:border-t-green-bright"
                  />
                </div>
              );
            }
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
