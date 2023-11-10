import type React from 'react';

export interface ButtonProps {
  content?: string | React.ReactElement;
  className?: string;
  onClick?: () => void;
}
