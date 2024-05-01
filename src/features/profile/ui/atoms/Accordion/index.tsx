import { useState } from 'react';
import { motion } from 'framer-motion';

import { IProfile } from '$features/profile/types/profile';

interface Props {
  item: IProfile<'accordion'>['items'][number];
}

export default function Accordion({ item }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const { list, subTitle } = item;

  return (
    <div>
      <h5
        role="presentation"
        onClick={toggleAccordion}
        className="p-4 bg-white dark:bg-black layout-border font-light max-md:text-sm border-2 rounded-lg cursor-pointer"
        style={{ borderColor: isOpen ? '#059669' : 'inherit' }}
      >
        {subTitle}
      </h5>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <ul className="list-disc p-2 pl-6 space-y-1">
          {list.map((content, idx) => (
            <li
              key={idx}
              className="list-disc marker:text-green-main dark:marker:text-green-brighter break-keep markdown-body text-sm"
            >
              {content}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
