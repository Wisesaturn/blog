import { ProjectItem } from '@Types/resume';

import Ping from '@components/Ping';

function ProjectSection({ data, isActive }: { data: ProjectItem; isActive?: boolean }) {
  const { content, info } = data;
  const {
    isAwarded,
    techStack,
    thumbnail,
    teamName,
    date,
    description,
    position,
    role,
    link,
    linkAlt,
  } = info;

  const infoClass = `${isActive ? `border-green-main` : `border-gray-300`}`;

  return (
    <div className="w-full flex h-auto max-md:flex-col">
      <div className="h-auto">
        <div className="flex items-center">
          <Ping isActive={isActive} />
          <h3 id={thumbnail} className="text-2xl font-semibold">
            {teamName}
            {isAwarded && <span className="pl-2">🏆</span>}
          </h3>
        </div>
        <div
          className={`${infoClass} py-2 mt-2 sticky ml-0.5 px-7 max-md:p-4 border-l-2 h-auto w-60 max-w-60 bg-gray-50 max-md:w-screen max-md:max-w-full`}
        >
          <p className="p-0 text-sm">{date}</p>
          <p className="p-0 text-sm">{role}</p>
          <p className="p-0 text-sm">{position}</p>
          <div className="py-4" />
          {description.map((item, idx) => (
            <p key={idx} className="p-0 text-sm text-gray-500">
              {item}
            </p>
          ))}
          <a href={link} target="_blank" className="text-sm link">
            {linkAlt ?? link}
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-8 max-md:gap-0 ml-0.5 pl-7 max-md:pl-0">
        {content.map((item, index) => {
          const { title, list } = item;

          return (
            <div key={index} className="max-md:pt-4 max-md:py-2 w-full max-md:mt-2 h-auto">
              <span className="font-bold text-lg">{title}</span>
              <ul className="p-0 m-0 pt-2">
                {list.map((text, idx) => (
                  <li key={idx} className="text-sm">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectSection;
