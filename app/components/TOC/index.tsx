import React from 'react';
import { css } from '@emotion/react';

export interface Heading {
  level: number;
  text: string;
  id: string;
}

interface Props {
  heading: Heading[];
  selectId: string;
}

export default function TOC(props: Props) {
  const { heading, selectId } = props;
  const selectClass = `text-black dark:text-white border-l-slate-500 dark:border-l-slate-200`;
  const nonSelectClass = `text-gray-500 border-l-slate-200 dark:border-l-[#454545] hover:bg-slate-100 hover:dark:bg-[#111] hover:dark:text-white hover:border-l-slate-500 hover:text-black`;

  const onClickRow = (e: React.MouseEvent<HTMLSpanElement>) => {
    const targetId = e.currentTarget.id;
    const headingElements = document.querySelectorAll(
      `h1[id="${targetId}"], h2[id="${targetId}"], h3[id="${targetId}"]`,
    );

    if (headingElements.length > 0) {
      const firstHeadingElement = headingElements[0] as HTMLElement;
      window.scrollTo({ top: firstHeadingElement.offsetTop - 32, behavior: 'smooth' });
    }
  };

  return (
    <aside className="fixed flex flex-col right-0 px-10 w-96 z-10 rounded-xl max-2xl:hidden">
      {heading.map((head) => {
        const choiceClass = `${selectId === head.id ? selectClass : nonSelectClass}`;

        return (
          <span
            key={head.id}
            id={head.id}
            className={`border-l-2 text-sm transition-colors py-1 pr-4 hover:cursor-pointer ${choiceClass}`}
            onClick={onClickRow}
            css={css`
              padding-left: calc(${head.level} * 1rem);
            `}
          >
            {head.text}
          </span>
        );
      })}
    </aside>
  );
}
