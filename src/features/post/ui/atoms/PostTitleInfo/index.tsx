import Icons from '$shared/ui/atoms/icons';

interface PostTitleInfo {
  createdAt: string;
  views: number;
}

export default function PostTitleInfo(props: PostTitleInfo) {
  const { views, createdAt } = props;
  return (
    <div className="flex gap-3 items-center align-middle text-gray-500 dark:text-gray-400">
      <div className="flex gap-1 items-center align-middle">
        <Icons.Date size="small" />
        <p className="layout-text dark:text-white">{createdAt}</p>
      </div>
      <div className="flex gap-1 items-center align-middle">
        <Icons.View size="small" />
        <p className="layout-text dark:text-white">{views}</p>
      </div>
    </div>
  );
}
