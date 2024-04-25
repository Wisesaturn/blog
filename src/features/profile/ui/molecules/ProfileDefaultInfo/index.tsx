import { motion } from 'framer-motion';

import { IProfile } from '$features/profile/types/profile';

import Badge from '$shared/ui/atoms/Badge';

interface Props extends GlobalAnimation {
  info: IProfile<'default'>;
}

export default function ProfileDefaultInfo({ animation, info }: Props) {
  const { title, items } = info;
  const { subTitle, link, date, list } = items;

  return (
    <motion.div variants={animation?.variants} className="space-y-1">
      <h4 className="text-2xl max-md:text-xl font-medium">{title}</h4>
      {subTitle && <Badge>{subTitle}</Badge>}
      {date && <div className="text-sm max-md:text-xs">{date}</div>}
      {link && <div className="text-sm max-md:text-xs">{link}</div>}
      {list && (
        <div>
          <hr className="mt-2 mb-4 max-md:mb-2" />
          <ul className="list-disc pl-6 max-md:pl-4 space-y-2 max-md:pt-2 pt-1">
            {list.map((l, idx) => (
              <li className="text-sm" key={l + idx}>
                {l}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
