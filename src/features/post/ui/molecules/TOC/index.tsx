import { motion } from 'framer-motion';

import useTOC from '$features/post/hooks/useTOC';

import TOCRow from '$features/post/ui/atoms/TOCRow';

interface TOCProps extends ReturnType<typeof useTOC> {}

export default function TOC(props: TOCProps) {
  const { Heading, selectId } = props;

  const selectedStyleClass = `text-black dark:text-white border-l-slate-500 dark:border-l-slate-200`;
  const nonSelectedStyleClass = `text-gray-500 border-l-slate-200 dark:border-l-[#454545] hover:bg-slate-100 hover:dark:bg-[#111] hover:dark:text-white hover:border-l-slate-500 hover:text-black`;

  const handleRowClick = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const offset = window.innerWidth < 786 ? -16 : -32;
      const targetOffsetTop = rect.top + scrollTop + offset;
      window.scrollTo({ top: targetOffsetTop, behavior: 'smooth' });
    }
  };

  return (
    <motion.aside className="w-full max-md:max-w-layout max-w-64 md:ml-10 pt-6">
      <div className="md:top-24 md:sticky max-md:block">
        <h3 className="leading-relaxed pb-2">목차</h3>
        <div className="overflow-y-auto max-h-96">
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
        </div>
      </div>
    </motion.aside>
  );
}
