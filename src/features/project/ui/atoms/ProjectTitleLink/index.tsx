import Icons from '$shared/ui/atoms/icons';

interface ProjectTitleLink {
  github?: string;
  website?: string;
}

export default function ProjectTitleLink({ github, website }: ProjectTitleLink) {
  return (
    <div className="flex gap-4 max-md:gap-2 items-center align-middle text-gray-600 dark:text-gray-300">
      {github && (
        <div className="flex gap-1 items-center align-middle hover:bg-gray-100 dark:hover:bg-transparent dark:hover:text-green-brighter dark:hover:border-green-brighter max-md:py-1 max-md:px-2 py-1.5 px-4 layout-border layout-rounded">
          <a className="flex gap-1 items-center" target="_blank" href={github} rel="noreferrer">
            <Icons.Github type="none" size="small" />
            <p className="text-sm max-md:text-xs">github</p>
          </a>
        </div>
      )}
      {website && (
        <div className="flex gap-1 items-center align-middle hover:bg-gray-100 dark:hover:bg-transparent dark:hover:text-green-brighter dark:hover:border-green-brighter max-md:py-1 max-md:px-2 py-1.5 px-4 layout-border layout-rounded">
          <a className="flex gap-1 items-center" target="_blank" href={website} rel="noreferrer">
            <Icons.Web type="none" size="small" />
            <p className="text-sm max-md:text-xs">website</p>
          </a>
        </div>
      )}
    </div>
  );
}
