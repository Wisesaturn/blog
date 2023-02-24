import thumbnailReview from '@public/default.png';
import type { PostTitleProps } from './types';

export default function PostTitle(props: PostTitleProps) {
  const { title, commentsSize, count, tags, createdAt, thumbnail } = props;

  return (
    <section className="relative max-h-60 shadow-lg rounded-2xl w-full max-w-layout mx-auto">
      <div className="relative text-white flex h-60 z-10 flex-col gap-4 items-center justify-center">
        <h1>
          <span className="text-gray-500">{'<'}</span> {title}{' '}
          <span className="text-gray-500">{'/>'}</span>
        </h1>
        <span>{tags}</span>
        <span>{createdAt}</span>
        <span>{count}</span>
        <span>{commentsSize}</span>
      </div>
      <div className="top-0 bottom-0 absolute brightness-[0.25] overflow-hidden rounded-2xl w-full max-w-layout">
        <img
          className="rounded-2xl w-full h-full object-cover object-left-top"
          alt="썸네일"
          src={thumbnail === '' ? thumbnailReview : thumbnail}
        />
      </div>
    </section>
  );
}
