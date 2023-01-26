import type { postingTypes } from '@Types/post';
import { Link } from '@remix-run/react';

export default function PostCardSection(props: { data: any }) {
  const { data } = props;
  return (
    <ul className="isWrapper flex-col justify-between align-center gap-10 md:flex-row">
      {data
        .sort((a: postingTypes, b: postingTypes) => {
          return a.date < b.date ? 1 : -1;
        })
        .map((post: postingTypes) => (
          <Link className="w-full" key={post.slug} to={post.slug}>
            <li className="flex flex-col justify-between gap-6 md:gap-8 relative md:flex-row md:h-40">
              <div className="rounded-lg w-full aspect-video md:aspect-video md:h-auto overflow-hidden shadow-md shadow-gray-300 md:min-w-[25%] md:w-1/2">
                <img
                  className="rounded-lg w-full h-full object-cover object-left-top"
                  alt="썸네일"
                  src={post.imgSrc}
                />
              </div>
              <div className="overflow-hidden flex justify-between flex-col md:w-full md:pl-5">
                <div className="flex justify-between items-center pb-3 md:pb-2">
                  <h2 className="md:before:content-['*'] md:before:pr-2 md:before:text-red-300 md:before:absolute md:before:-translate-x-4 md:before:translate-y-0.5">
                    {post.title ?? '글 제목 영역'}
                  </h2>
                  <h4>{post.date.split('T')[0] ?? '작성일'}</h4>
                </div>
                <p className="h-16 md:h-24 after:content-[''] after:bg-gradient-to-r after:from-[rgb(255,255,255,0)] after:to-[rgb(255,255,255,1)] after:p-3 after:pl-10 after:bottom-0 after:right-0 after:absolute after:-ml-10">
                  {post.body.replace(/[#;]*/g, '').replace(/{[^{}]*}|`[^`]*`/g, '[Code]') ??
                    '글 내용'}
                </p>
              </div>
            </li>
          </Link>
        ))}
    </ul>
  );
}
