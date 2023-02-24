import type { postingTypes } from '@Types/post';
import { Link } from '@remix-run/react';
// eslint-disable-next-line import/no-unresolved
import thumbnailReview from '@public/default.png';

export default function PostCardSection(props: { data: any }) {
  const { data } = props;
  return (
    <ul className="isWrapper w-full flex-col gap-10 justify-between align-center md:flex-row">
      {data
        .sort((a: postingTypes, b: postingTypes) => {
          return a.createdAt < b.createdAt ? 1 : -1;
        })
        .map((post: postingTypes) => (
          <Link
            prefetch="render"
            className="w-full"
            key={post.index}
            to={String(post.title).replace(/\s+/g, '-')}
          >
            <li className="flex flex-col justify-between gap-6 md:gap-8 relative md:flex-row md:h-40">
              <div className="rounded-lg w-full aspect-video md:h-auto overflow-hidden shadow-md shadow-gray-300 md:w-1/2">
                <img
                  className="rounded-lg w-full h-full object-cover object-left-top"
                  alt="썸네일"
                  src={post.thumbnail === '' ? thumbnailReview : post.thumbnail}
                />
              </div>
              <div className="overflow-hidden flex justify-between flex-col md:w-full md:pl-5 ">
                <div className="flex justify-between items-center pb-3 md:pb-2">
                  <h2 className="md:before:content-['*'] md:before:pr-2 md:before:text-red-300 md:before:absolute md:before:-translate-x-4 md:before:translate-y-0.5">
                    {post.title ?? '글 제목 영역'}
                  </h2>
                  <h4>{post.createdAt ?? '작성일'}</h4>
                </div>
                <span className="h-16 md:h-24 md:text-[1rem] text-[0.9rem] font-light after:content-[''] after:bg-gradient-to-r after:from-[rgb(255,255,255,0)] after:to-[rgb(255,255,255,1)] after:p-3 after:pl-10 after:bottom-0 after:right-0 after:absolute after:-ml-10">
                  {post.description ?? '글 내용'}
                </span>
              </div>
            </li>
          </Link>
        ))}
    </ul>
  );
}
