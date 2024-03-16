import React from 'react';
import { Link } from '@remix-run/react';

import Theme from '$shared/styles/color/theme';

interface NavButtonProps {
  children: IconElement;
  isSelected: boolean;
  to: string;
}

/**
 * @private
 * @summary Navigation Bar에 내부 Icon Button
 * @returns
 */
export default function NavButton(props: NavButtonProps) {
  const { children, isSelected, to } = props;

  const SELECTED_CLASS = `fill-green-main hover:fill-green-darker active:fill-green-dark hover:bg-gray-100 active:bg-gray-200 dark:fill-green-main hover:dark:fill-green-darker hover:dark:bg-gray-100 active:dark:bg-gray-200 active:dark:fill-green-dark`;
  const NON_SELECTED_CLASS = `hover:dark:fill-green-main hover:dark:bg-gray-100 active:dark:bg-gray-200`;

  const modifiedChildren = React.cloneElement(children, {
    className: `${Theme.PURE_ICON_CLASS} ${isSelected ? SELECTED_CLASS : NON_SELECTED_CLASS}`,
  });

  return <Link to={to}>{modifiedChildren}</Link>;
}
