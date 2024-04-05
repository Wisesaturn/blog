import Icons from '$shared/ui/atoms/icons';

interface ArticleTitleInfo {
  createdAt: string;
  views: number;
}

export default function ArticleTitleInfo(props: ArticleTitleInfo) {
  const { views, createdAt } = props;
  return (
    <div className="flex gap-4 items-center align-middle text-gray-600 dark:text-gray-300">
      <div className="flex gap-1 items-center align-middle">
        <Icons.Date className="icons-size-small pr-1" />
        <p className="layout-text">{createdAt}</p>
      </div>
      <div className="flex gap-1 items-center align-middle">
        <Icons.View className="icons-size-small pr-1" />
        <p className="layout-text">{views}</p>
      </div>
    </div>
  );
}
