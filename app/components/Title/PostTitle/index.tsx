import type { PostTitleProps } from './types';

export default function PostTitle(props: PostTitleProps) {
  const { title, commentsSize, count, tags, createdAt } = props;

  return (
    <section className="flex z-10 flex-col shadow-lg rounded-2xl gap-4 items-center justify-center w-full mx-auto py-6">
      <div className="bg-black rounded-t-2xl h-60 w-full"></div>
      <h1>
        <span className="text-gray-200">{'<'}</span> {title}{' '}
        <span className="text-gray-200">{'/>'}</span>
      </h1>
      <span>{tags}</span>
      <span>{createdAt}</span>
      <span>{count}</span>
      <span>{commentsSize}</span>
    </section>
  );
}
