import React from 'react';
import { Link } from 'react-router';

interface NavButtonProps {
  /** `cloneElement` 로 `className` 을 주입하므로 그 prop 을 타입에 적는다. */
  children: React.ReactElement<{ className?: string }>;
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

  const SELECTED_CLASS = `fill-green-main dark:fill-green-brighter`;
  const NON_SELECTED_CLASS = `dark:hover:fill-green-main hover:bg-white`;

  const modifiedChildren = React.cloneElement(children, {
    className: `icons-pure ${isSelected ? SELECTED_CLASS : NON_SELECTED_CLASS}`,
  });

  return <Link to={to}>{modifiedChildren}</Link>;
}
