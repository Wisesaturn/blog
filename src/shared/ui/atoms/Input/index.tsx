import { forwardRef, useEffect, useState } from 'react';

import Theme from '$shared/styles/color/theme';
import useDebounce from '$shared/hooks/useDebounce';

import Icons from '../icons';

type InputType = 'normal' | 'search';
interface InputProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  type?: InputType;
  handleSearch?: (value: string) => void;
  handleChange?: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { type = 'normal', handleSearch, handleChange, ...rest } = props;
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  // Reset input value
  const resetInput = () => {
    setValue('');
  };

  // Callback function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (handleChange) {
      handleChange(debouncedValue); // Notify parent component of value change
    }
  };

  // Callback function to handle search
  const handleSearchClick = () => {
    if (handleSearch) {
      handleSearch(debouncedValue); // Notify parent component of search with debounced value
    }
  };

  // Handle esc and enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      resetInput();
    }

    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="flex gap-2 h-[42px] max-md:h-[38px]">
      <div className="border-[1px] rounded-md flex w-full items-center justify-between">
        <input
          tabIndex={0}
          ref={ref}
          value={value}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          className="w-full h-full p-4"
          {...rest}
        />
        {value !== '' && (
          <button tabIndex={0} type="button" onClick={resetInput} className="w-fit h-full">
            <Icons.Cancel className={`h-full w-fit p-1.5 ${Theme.PURE_ICON_CLASS}`} />
          </button>
        )}
      </div>
      {type === 'search' && (
        <button tabIndex={0} type="button" onClick={handleSearchClick}>
          <Icons.Search
            className={`${Theme.PURE_ICON_CLASS} w-[42px] max-md:w-[38px] max-md:p-2 p-1.5 border-[1px] rounded-md h-full`}
          />
        </button>
      )}
    </div>
  );
});

export default Input;
