import { motion } from 'framer-motion';

import { IProfile } from '$features/profile/types/profile';

import Badge from '$shared/ui/atoms/Badge';

interface Props extends GlobalAnimation {
  info: IProfile<'default'>;
}

export default function ProfileDefaultInfo({ animation, info }: Props) {
  const { title, items } = info;
  const { badge, link, date, list } = items;

  return (
    <motion.div variants={animation?.variants} className="space-y-1">
      <h4 className="text-2xl max-md:text-xl font-medium">{title}</h4>
      {badge && <Badge>{badge}</Badge>}
      {date && <span className="block text-sm max-md:text-xs font-light">{date}</span>}
      {link && (
        <span className="markdown-body">
          <a target="_blank" href={link} className="text-sm max-md:text-xs" rel="noreferrer">
            {link}
          </a>
        </span>
      )}
      {list && (
        <div>
          <hr className="mt-2 mb-4 max-md:mb-2" />
          <ul className="list-disc pl-6 max-md:pl-4 space-y-2 max-md:pt-2 pt-1">
            {list.map((l, idx) => (
              <li className="text-sm break-keep markdown-body" key={title + idx}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
