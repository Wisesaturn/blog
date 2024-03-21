import { Heading } from '$features/post/types/article';

interface TOCRowProps extends Heading {
  className: string;
  handleClick: (_i: string) => void;
}

export default function TOCRow(props: TOCRowProps) {
  const { className, id, text, handleClick } = props;
  return (
    <div
      role="presentation"
      onClick={(e) => handleClick(e.currentTarget.id)}
      key={id}
      id={id}
      className={`${className} border-l-2 break-keep text-sm transition-colors py-1 pr-4 hover:cursor-pointer`}
    >
      {text}
    </div>
  );
}
