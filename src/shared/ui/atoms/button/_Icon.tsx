import React from 'react';

import Icons from '../icons';

/**
 * @private
 * @summary Compound Button Component for icon
 * @returns
 */
export default function ButtonIcon({
  children,
  className,
}: {
  children: React.ReactElement;
  className?: string;
}) {
  // error message
  if (!React.Children.only(children)) {
    throw new Error('하나의 아이콘만 가능합니다');
  }

  if (React.isValidElement(children)) {
    if (!Object.values(Icons).includes(children.type))
      throw new Error('Icons 컴포넌트를 렌더링해야 합니다');
  }

  // custom props
  const CustomButtonIcon = () => React.cloneElement(children, { size: 'small' });

  return (
    <div className={`${className || 'text-gray-700 dark:text-gray-400'}`}>
      <CustomButtonIcon />
    </div>
  );
}
