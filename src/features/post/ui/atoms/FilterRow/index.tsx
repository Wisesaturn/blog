import { POST_FILTER_TO_ORDER_BY } from '$features/post/constant';
import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import { PostsFilter } from '$features/post/types/post';

interface FilterRowProps {
  text: PostsFilter;
  selected: boolean;
  handleClick: () => void;
}

export default function FilterRow(props: FilterRowProps) {
  const { text, selected, handleClick } = props;
  const { setSelectedParams } = useUrlParamsUpdater();

  const handleFilterRowClick = () => {
    setSelectedParams('orderby', POST_FILTER_TO_ORDER_BY[text], false);
    handleClick();
  };

  return (
    <button className="" type="button" onClick={handleFilterRowClick}>
      {text}
    </button>
  );
}
