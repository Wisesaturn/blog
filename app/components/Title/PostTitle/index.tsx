import thumbnailReview from '@public/default.png';
import type { PostTitleProps } from './types';

export default function PostTitle(props: PostTitleProps) {
  const { title, tags, createdAt, thumbnail } = props;

  return (
    <section className="relative max-h-40 shadow-lg rounded-2xl w-full max-w-layout mx-auto">
      <div className="relative text-white flex h-40 z-10 flex-col gap-3 items-center justify-center">
        <h1>
          <span className="text-green-brighter">{'<'}</span> {title}{' '}
          <span className="text-green-brighter">{'/>'}</span>
        </h1>
        <div className="flex items-center text-[0.875rem] justify-center flex-col">
          <div className="font-light">{createdAt}</div>
          <div>
            {tags.map((e, idx) => {
              return (
                <span className="py-0.5 px-2 text-green-brighter font-bold rounded-sm" key={idx}>
                  # {e}
                </span>
              );
            })}
          </div>
        </div>
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
