import { TextItem } from '@Types/resume';

export default function TextSection({
  title,
  thumbnail,
  position,
  tasks,
  date,
  link,
  linkAlt,
}: TextItem) {
  return (
    <div className="w-full flex h-auto flex-col">
      <h3 id={thumbnail}>{title}</h3>
      <span className="text-base bg-gray-200 px-2 mb-1 w-max">{position}</span>
      <span className="text-sm mb-1 w-max">{date}</span>
      <a href={link} target="_blank" className="text-sm link">
        {linkAlt ?? link}
      </a>
      <hr className="my-2" />
      <ul className="p-0 m-0 pt-3">
        {tasks.map((task, index) => (
          <li key={index} className="text-sm">
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}
