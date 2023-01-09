import type { ButtonProps } from './types';

export default function Button(props: ButtonProps) {
  const { isLabel, className } = props;
  const isDefaultStyle = 'rounded bg-gray-100 hover:fill-lightgreen p-1 md:p-3';
  const isButtonStyle = `${className} ${isDefaultStyle}`;

  return <button className={isButtonStyle}>{isLabel}</button>;
}
