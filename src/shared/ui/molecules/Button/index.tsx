import React from 'react';

import ButtonIcon from '$shared/ui/atoms/button/_Icon';
import ButtonText from '$shared/ui/atoms/button/_Text';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button(props: ButtonProps) {
  const { children, type = 'button', ...rest } = props;

  if (React.Children.count(children) === 0) {
    throw new Error('하나의 자식 컴포넌트가 필요합니다');
  }

  if (React.isValidElement(children)) {
    if (
      children.type !== React.Fragment &&
      children.type !== ButtonText &&
      children.type !== ButtonIcon
    )
      throw new Error('Button에 속한 컴포넌트를 렌더링해야 합니다');
  }

  return (
    <button
      className="flex gap-4 items-center layout-text-color layout-rounded layout-bg layout-text layout-border px-8 py-2.5"
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.Text = ButtonText;
Button.Icon = ButtonIcon;

export default Button;
