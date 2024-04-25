import { motion } from 'framer-motion';
import { useState } from 'react';

import { IProfile } from '$features/profile/types/profile';

interface Props extends GlobalAnimation {
  info: IProfile<'accordion'>;
}

export default function ProfileAccordionInfo({ animation, info }: Props) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [animatingIndexes, setAnimatingIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setAnimatingIndexes((prevAnimating) => [...prevAnimating, index]);
    setOpenIndexes((prevOpenIndexes) => {
      if (prevOpenIndexes.includes(index)) {
        return prevOpenIndexes.filter((i) => i !== index);
      }
      return [...prevOpenIndexes, index];
    });
  };

  const handleAnimationComplete = (index: number) => {
    if (openIndexes.includes(index)) {
      setAnimatingIndexes((prevAnimating) => prevAnimating.filter((i) => i !== index));
    }
  };

  const { title, items } = info;

  return (
    <motion.div variants={animation?.variants} className="space-y-4">
      <h4 className="text-2xl max-md:text-xl font-medium">{title}</h4>
      <div className="grid grid-cols-2 gap-4 max-md:gap-2 max-md:grid-cols-1">
        {items.map((item, index) => {
          const { subTitle, list } = item;
          const isOpen = openIndexes.includes(index);
          const isAnimating = animatingIndexes.includes(index);

          return (
            <div key={index}>
              <div
                role="presentation"
                onClick={() => toggleAccordion(index)}
                className="p-4 bg-white dark:bg-black font-semibold max-md:text-sm border-2 rounded-lg cursor-pointer"
              >
                {subTitle}
              </div>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  height: isOpen ? 'auto' : 0,
                }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => handleAnimationComplete(index)}
                style={{ overflow: 'hidden' }}
              >
                {(isAnimating || isOpen) && (
                  <div className="space-y-1">
                    {list.map((content, idx) => (
                      <div key={idx} className="text-base max-md:text-sm">
                        {content}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
