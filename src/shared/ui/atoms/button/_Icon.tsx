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
  /** `cloneElement` 로 `size` 를 주입하므로 그 prop 을 타입에 적는다. React 19 에서
   *  `ReactElement` 의 기본 props 가 `any` 에서 `unknown` 으로 바뀌어 명시가 필요하다. */
  children: React.ReactElement<IconProps>;
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
