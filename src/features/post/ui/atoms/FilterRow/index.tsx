import { SORT_FILTER_MAP } from '$features/post/constant';
import useUrlParamsUpdater from '$features/post/hooks/useUrlParamsUpdater';
import { PostsFilter } from '$features/post/types/post';

interface FilterRowProps {
  text: PostsFilter;
}

export default function FilterRow(props: FilterRowProps) {
  const { text } = props;
  const { setSelectedParams } = useUrlParamsUpdater();

  const handleClick = () => {
    setSelectedParams('orderby', SORT_FILTER_MAP[text], false);
  };

  return (
    <button type="button" onClick={handleClick}>
      {text}
    </button>
  );
}
