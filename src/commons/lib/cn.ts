import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @description clsx + tailwind-merge 조합 유틸
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
