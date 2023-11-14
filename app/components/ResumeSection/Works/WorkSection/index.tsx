import { WorkItem } from '@Types/resume';

import Ping from '@components/Ping';

export default function WorkSection({ data, isActive }: { data: WorkItem; isActive?: boolean }) {
  const { content, info } = data;
  const { company, date, description, position, role, link } = info;

  const infoClass = `${isActive ? `border-green-main` : `border-gray-300`}`;

  return (
    <div className="w-full flex h-auto max-md:flex-col mb-8">
      <div className="h-auto">
        <div className="flex items-center">
          <Ping isActive={isActive} />
          <h3 className="text-xl font-semibold">{company}</h3>
        </div>
        <div
          className={`${infoClass} py-2 mt-2 sticky ml-0.5 pl-7 border-l-2 h-auto w-60 max-w-60 bg-gray-50 max-md:w-screen max-md:max-w-full`}
        >
          <p className="p-0 text-[14px]">{date}</p>
          <p className="p-0 text-[14px]">{role}</p>
          <p className="p-0 text-[14px]">{position}</p>
          <div className="py-4" />
          {description.map((item) => (
            <p className="p-0 text-[14px] text-gray-500">{item}</p>
          ))}
          <div className="text-blue-500">
            <a href={link} target="_blank" className="text-[14px] link">
              {link}
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 max-md:gap-0 ml-0.5 pl-7 max-md:pl-0">
        {content.map((item) => {
          const { title, list } = item;

          return (
            <div className="max-md:pt-4 max-md:py-2 w-full max-md:mt-2 h-auto">
              <span className="font-bold text-[22px]">{title}</span>
              <ul className="p-0 m-0 pt-2">
                {list.map((text) => (
                  <li>{text}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
