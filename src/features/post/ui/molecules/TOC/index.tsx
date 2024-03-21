import { motion } from 'framer-motion';

import useTOC from '$features/post/hooks/useTOC';

import TOCRow from '../../atoms/TOCRow';

export default function TOC(props: ReturnType<typeof useTOC>) {
  const { Heading, selectId } = props;

  const selectedStyleClass = `text-black dark:text-white border-l-slate-500 dark:border-l-slate-200`;
  const nonSelectedStyleClass = `text-gray-500 border-l-slate-200 dark:border-l-[#454545] hover:bg-slate-100 hover:dark:bg-[#111] hover:dark:text-white hover:border-l-slate-500 hover:text-black`;

  const handleRowClick = (targetId: string) => {
    const headingElements = document.querySelectorAll(
      `h2[id="${targetId}"], h3[id="${targetId}"], h4[id="${targetId}"]`,
    );

    if (headingElements.length > 0) {
      const firstHeadingElement = headingElements[0] as HTMLElement;
      window.scrollTo({ top: firstHeadingElement.offsetTop - 32, behavior: 'smooth' });
    }
  };

  return (
    <motion.aside className="sticky w-full max-md:max-w-layout max-w-80">
      {Heading.map((head, idx) => {
        const selectedClass = `${selectId === head.id ? selectedStyleClass : nonSelectedStyleClass}`;
        let hierarchyClass = `pl-3`;

        if (head.level === 3) hierarchyClass = 'pl-6';
        else if (head.level === 4) hierarchyClass = 'pl-9';

        return (
          <TOCRow
            key={idx}
            handleClick={handleRowClick}
            className={`${selectedClass} ${hierarchyClass}`}
            {...head}
          />
        );
      })}
    </motion.aside>
  );
}
