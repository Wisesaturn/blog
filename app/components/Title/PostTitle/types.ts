import type { ITags } from '@Types/post';

export interface PostTitleProps {
  title: string;
  createdAt: string | number;
  tags: ITags[];
  thumbnail: string;
}
