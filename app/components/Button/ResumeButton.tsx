import { css } from '@emotion/react';
import React from 'react';

import type { SectionType } from 'routes/resume/index';

interface ResumeButtonProps {
  target: SectionType;
  onClick: (category: SectionType) => void;
  selected: SectionType;
}

function ResumeButton(props: ResumeButtonProps) {
  const { target, onClick, selected } = props;

  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onClick(target);
  };

  return (
    <button
      css={css`
        color: ${selected !== target ? '#18191b' : 'white'} !important;
        background-color: ${selected !== target ? 'white' : '#18191b'};
      `}
      className="px-6 py-2 rounded-full"
      onClick={onButtonClick}
    >
      {target}
    </button>
  );
}

export default ResumeButton;
