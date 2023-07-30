import { css } from '@emotion/react';

import type { SectionType } from 'routes/resume/index';

interface ResumeButtonProps {
  key?: number;
  target: SectionType;
  onClick: (category: SectionType) => void;
  selected: SectionType;
}

export default function ResumeButton(props: ResumeButtonProps) {
  const { key, target, onClick, selected } = props;

  return (
    <a
      key={key}
      css={css`
        color: ${selected !== target ? '#18191b' : 'white'} !important;
        background-color: ${selected !== target ? 'white' : '#18191b'};
      `}
      href={`#${target}`}
      className="px-6 py-1 rounded-full"
    >
      <div onClick={() => onClick(target)}>{target}</div>
    </a>
  );
}
