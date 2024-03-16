import { forwardRef } from 'react';

import Icons from '../icons';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { ...rest } = props;

  return (
    <div className="flex gap-1">
      <input className="border-[1px] rounded-sm" {...rest} />
      <div className="border-[1px] rounded-sm">
        <Icons.Search />
      </div>
    </div>
  );
});

export default Input;
