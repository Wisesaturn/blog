import { motion } from 'framer-motion';

import PROFILE from '$features/profile/constant/profile';

import Badge from '$shared/ui/atoms/Badge';

export default function Education({ animation }: GlobalAnimation) {
  return (
    <>
      <motion.h3 className="text-3xl max-md:text-2xl" variants={animation?.variants}>
        Education
      </motion.h3>
      <motion.section
        className="pt-8 pb-4 max-md:pt-4 max-md:pb-2 flex flex-col gap-8 max-md:gap-6"
        variants={animation?.variants}
      >
        {PROFILE.education.map((item, idx) => (
          <div key={`${item.title + idx}`} className="space-y-1">
            <h4 className="text-2xl max-md:text-xl">{item.title}</h4>
            {item.content && <Badge>{item.content}</Badge>}
            <div className="text-sm max-md:text-xs">{item.date}</div>
          </div>
        ))}
      </motion.section>
    </>
  );
}
