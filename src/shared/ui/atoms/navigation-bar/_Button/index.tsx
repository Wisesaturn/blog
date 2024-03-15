import React from 'react';
import { Link } from '@remix-run/react';

import Theme from '$shared/styles/color/theme';

interface NavButtonProps {
  children: React.ReactElement;
  isSelected: boolean;
  to: string;
}

/**
 * @summary Navigation Bar에 내부 Icon Button
 * @param props
 * @returns
 */
export default function NavButton(props: NavButtonProps) {
  const { children, isSelected, to } = props;

  const SELECTED_CLASS = `fill-green-main hover:fill-green-darker active:fill-green-darkest`;

  const modifiedChildren = React.cloneElement(children, {
    className: `${Theme.PURE_ICON_CLASS} ${isSelected ? SELECTED_CLASS : ''}`,
  });

  return <Link to={to}> {modifiedChildren}</Link>;
}
