import Icons from '$shared/ui/atoms/icons';

interface ProjectTitleInfo {
  date: {
    start: string;
    end: string;
  };
  views: number;
}

export default function ProjectTitleInfo(props: ProjectTitleInfo) {
  const { views, date } = props;
  return (
    <div className="flex gap-4 items-center align-middle text-gray-600 dark:text-gray-300">
      <div className="flex gap-1 items-center align-middle">
        <Icons.Date className="icons-size-small pr-1" />
        <div className="flex gap-1">
          <p className="layout-text">{date.start}</p>
          <p>~</p>
          <p className="layout-text">{date.end}</p>
        </div>
      </div>
      <div className="flex gap-1 items-center align-middle">
        <Icons.View className="icons-size-small pr-1" />
        <p className="layout-text">{views}</p>
      </div>
    </div>
  );
}
