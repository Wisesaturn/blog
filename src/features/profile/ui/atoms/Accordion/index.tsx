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
        className="p-4 bg-white dark:bg-black font-light max-md:text-sm border-2 rounded-lg cursor-pointer"
      >
        {subTitle}
      </h5>
      <motion.ul
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          height: isOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
        className="list-disc"
      >
        <div className="p-2 space-y-1">
          {list.map((content, idx) => (
            <li key={idx} className="break-keep markdown-body text-sm">
              {content}
            </li>
          ))}
        </div>
      </motion.ul>
    </div>
  );
}
