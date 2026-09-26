import { motion } from 'motion/react';

import Icons from '@/commons/ui/icons/Icons';

import TOCRow from './TOCRow';
import getHeading from '../lib/getHeading';
import useTOC from '../model/useTOC';

interface TOCProps {
  body: string;
}

/* -------------------------------------------------------------------------------------------------
 * TOC
 * 본문 제목(h2~h4)으로 가는 목차. 모바일에서는 본문 위에 접힌 채로 두고, 데스크톱에서는 본문 옆에
 * sticky 로 펼쳐 둔다.
 *
 * 하나의 <details> 를 화면 크기마다 다르게 여닫으면 prerender 한 HTML 과 첫 화면이 어긋난다.
 * 그래서 목록을 모바일용과 데스크톱용으로 두 번 그리고 CSS 로 하나만 보인다. 숨긴 쪽은 display: none
 * 이라 보조 기술에도 한 번만 읽힌다.
 * -----------------------------------------------------------------------------------------------*/
export default function TOC({ body }: TOCProps) {
  const { selectId } = useTOC();
  const headings = getHeading(body);

  if (headings.length === 0) return null;

  const rows = headings.map((head) => (
    <TOCRow key={head.id} {...head} selected={selectId === head.id} />
  ));

  return (
    <motion.aside className="w-full max-md:max-w-layout md:w-56 md:shrink-0 md:ml-8 pt-6">
      <nav aria-label="목차" className="md:sticky md:top-24">
        <details className="group md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 font-semibold [&::-webkit-details-marker]:hidden">
            목차
            <Icons.ArrowDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <div className="pt-2">{rows}</div>
        </details>

        <div className="max-md:hidden">
          <p className="pb-2 font-semibold leading-relaxed">목차</p>
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">{rows}</div>
        </div>
      </nav>
    </motion.aside>
  );
}
