import { cn } from '@/commons/lib';

import { type IHeading } from '../model/types';

interface TOCRowProps extends IHeading {
  selected: boolean;
}

const INDENT: Record<number, string> = { 2: 'pl-3', 3: 'pl-6', 4: 'pl-9', 5: 'pl-12' };

/* -------------------------------------------------------------------------------------------------
 * TOCRow
 * 목차 항목 하나. 제목으로 가는 링크라 탭으로 이동하고 엔터로 연다. 제목이 헤더에 가리지 않도록
 * 스크롤 위치는 본문 제목의 scroll-margin-top 이 정한다.
 * -----------------------------------------------------------------------------------------------*/
export default function TOCRow({ id, text, level, selected }: TOCRowProps) {
  return (
    <a
      href={`#${id}`}
      aria-current={selected ? 'location' : undefined}
      className={cn(
        'block border-l-2 py-1 pr-4 text-sm break-keep [overflow-wrap:anywhere] transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--toc-active-line)',
        INDENT[level] ?? 'pl-3',
        selected
          ? 'border-l-(--toc-active-line) font-semibold text-(--toc-active)'
          : 'border-l-(--toc-line) text-(--toc-muted) hover:border-l-(--toc-active-line) hover:bg-(--toc-hover-bg) hover:text-(--toc-active)',
      )}
    >
      {text}
    </a>
  );
}
