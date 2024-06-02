import { motion } from 'framer-motion';

import TOCRow from '$features/post/ui/atoms/TOCRow';
import useTOC from '$features/post/hooks/useTOC';
import getHeading from '$features/post/lib/getHeading';

interface TOCProps {
  body: string;
}

export default function TOC(props: TOCProps) {
  const { selectId } = useTOC();
  const Heading = getHeading(props.body);

  const SELECTED_STYLE_CLASS = `text-black dark:text-white border-l-slate-500 dark:border-l-slate-200`;
  const NON_SELECTED_STYLE_CLASS = `text-gray-500 border-l-slate-200 dark:border-l-[#454545] hover:bg-slate-100 hover:dark:bg-[#111] hover:dark:text-white hover:border-l-slate-500 hover:text-black`;

  const handleRowClick = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // target scroll 상대적인 위치 (top : 현재 위치에서 위에 있으면 -, 아래에 있으면 +)
      const rect = targetElement.getBoundingClientRect();
      // 현재 viewport의 scroll height
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const offset = window.innerWidth < 786 ? -16 : -32;
      const targetOffsetTop = rect.top + scrollTop + offset;
      window.scrollTo({ top: targetOffsetTop, behavior: 'smooth' });
    }
  };

  return (
    <motion.aside className="w-full max-md:max-w-layout max-w-64 md:ml-10 pt-6">
      <div className="md:top-24 md:sticky max-md:block">
        <h4 className="leading-relaxed pb-2">목차</h4>
        <div className="overflow-y-auto max-h-96">
          {Heading.map((head, idx) => {
            const SELECTED_CLASS = `${selectId === head.id ? SELECTED_STYLE_CLASS : NON_SELECTED_STYLE_CLASS}`;
            let hierarchyClass = `pl-3`;

            if (head.level === 3) hierarchyClass = 'pl-6';
            else if (head.level === 4) hierarchyClass = 'pl-9';

            return (
              <TOCRow
                key={idx}
                handleClick={handleRowClick}
                className={`${SELECTED_CLASS} ${hierarchyClass}`}
                {...head}
              />
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
