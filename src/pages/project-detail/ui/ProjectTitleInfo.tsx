import Icons from '@/commons/ui/icons/Icons';
import StatCount from '@/commons/ui/StatCount';

interface ProjectTitleInfo {
  date: {
    start: string;
    end: string | null;
  };
  views: number | null | undefined;
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
        <StatCount value={views} label="조회수" />
      </div>
    </div>
  );
}
