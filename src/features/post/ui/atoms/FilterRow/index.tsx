interface FilterRowProps {
  handleClick: () => void;
  text: string;
}

export default function FilterRow(props: FilterRowProps) {
  const { text, handleClick } = props;
  return (
    <button type="button" onClick={handleClick}>
      {text}
    </button>
  );
}
