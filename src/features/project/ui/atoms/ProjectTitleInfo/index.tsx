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
    <div className="flex gap-3 items-center align-middle text-gray-500 dark:text-gray-400">
      <div className="flex gap-1 items-center align-middle">
        <Icons.Date size="small" />
        <div className="flex gap-1">
          <p className="layout-text dark:text-white">{date.start}</p>
          <p>~</p>
          <p className="layout-text dark:text-white">{date.end}</p>
        </div>
      </div>
      <div className="flex gap-1 items-center align-middle">
        <Icons.View size="small" />
        <p className="layout-text dark:text-white">{views}</p>
      </div>
    </div>
  );
}
