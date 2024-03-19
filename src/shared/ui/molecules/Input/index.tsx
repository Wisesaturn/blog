import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

import Theme from '$shared/styles/color/theme';
import Icons from '$shared/ui/atoms/icons';

type InputType = 'normal' | 'search';
interface InputProps
  extends GlobalAnimation,
    Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  placeholder: string;
  description?: string;
  inputType?: InputType;
  initialValue?: string;
  handleEsc?: () => void;
  handleSearch?: (value: string) => void;
  handleChange?: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    label,
    description,
    animation,
    className,
    inputType = 'normal',
    placeholder,
    initialValue,
    handleEsc,
    handleSearch,
    handleChange,
    ...rest
  } = props;
  const [value, setValue] = useState(initialValue || '');

  // Reset input value
  const resetInput = () => {
    if (handleEsc) {
      handleEsc();
    }
    setValue('');
  };

  // Callback function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (handleChange) {
      handleChange(value); // Notify parent component of value change
    }
  };

  // Callback function to handle search
  const handleSearchClick = () => {
    if (handleSearch) {
      handleSearch(value); // Notify parent component of search with debounced value
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
    <motion.div variants={animation?.variants} className={`flex flex-col`}>
      {label && (
        <label htmlFor={label} className="text-base max-md:text-sm font-light">
          {label}
        </label>
      )}
      <div className={`flex gap-2 h-[42px] max-md:h-[38px] ${className}`}>
        <div className="border-[1px] border-gray-300 rounded-md flex w-full items-center justify-between focus-within:border-black dark:focus-within:border-white">
          <input
            id={label}
            tabIndex={0}
            ref={ref}
            value={value}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full h-full p-4 dark:bg-transparent rounded-md"
            {...rest}
          />
          {value !== '' && (
            <button tabIndex={0} type="button" onClick={resetInput} className="w-fit h-full">
              <Icons.Cancel className={`h-full w-fit p-1.5 ${Theme.PURE_ICON_CLASS}`} />
            </button>
          )}
        </div>
        {inputType === 'search' && (
          <button tabIndex={0} type="button" onClick={handleSearchClick}>
            <Icons.Search
              className={`${Theme.PURE_ICON_CLASS} w-[42px] max-md:w-[38px] max-md:p-2 p-1.5 border-[1px] rounded-md h-full`}
            />
          </button>
        )}
      </div>
      {description && <span className="text-sm font-light text-gray-500 pt-2">{description}</span>}
    </motion.div>
  );
});

export default Input;
