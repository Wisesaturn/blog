import { css } from '@emotion/react';

import type { SectionType } from 'routes/resume/index';

interface ResumeButtonProps {
  key?: number;
  target: SectionType;
  onClick: (category: SectionType) => void;
  selected: SectionType;
}

function ResumeButton(props: ResumeButtonProps) {
  const { key, target, onClick, selected } = props;

  return (
    <button
      key={key}
      css={css`
        color: ${selected !== target ? '#18191b' : 'white'} !important;
        background-color: ${selected !== target ? 'white' : '#18191b'};
      `}
      className="px-6 py-2 rounded-full"
      onClick={() => onClick(target)}
    >
      {target}
    </button>
  );
}

export default ResumeButton;
