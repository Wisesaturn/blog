import type { ButtonProps } from './types';

export default function Button(props: ButtonProps) {
  const { content, className, onClick } = props;
  const isDefaultStyle =
    'rounded bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition ease p-1 md:p-3';
  const isButtonStyle = `${className} ${isDefaultStyle}`;

  return (
    <button onClick={onClick} className={isButtonStyle}>
      {content}
    </button>
  );
}
