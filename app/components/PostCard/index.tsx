// eslint-disable-next-line import/no-unresolved

import { Link } from '@remix-run/react';

import thumbnailDefault from '@public/thumbnail.webp';

import type { IPost, ITags } from '@Types/post';

export default function PostCardSection(props: { data: IPost[] }) {
  const { data } = props;

  return (
    <section className="isWrapper w-full flex-col md:gap-6 gap-3 justify-between align-center md:flex-row">
      {data.map((post: IPost) => {
        return (
          <Link
            prefetch="none"
            reloadDocument
            className="w-full"
            key={post.index}
            to={`${
              post.category
                ? `/${post.category}/${String(post.plain_title).replace(/\s+/g, '-')}`
                : `${String(post.plain_title).replace(/\s+/g, '-')}`
            }`}
          >
            <div className="hover:bg-gray-100 hidden-blur p-2 rounded-lg flex flex-col justify-between gap-6 md:gap-8 relative md:flex-row md:h-50">
              <div className="rounded-lg w-full aspect-video md:h-auto overflow-hidden shadow-md shadow-gray-300 md:w-1/2">
                <img
                  className="bg-gray-100 animate-skeletonUI rounded-lg w-full h-full object-cover"
                  alt="썸네일"
                  src={post.thumbnail === '' ? thumbnailDefault : post.thumbnail}
                />
              </div>
              <div className="overflow-hidden flex justify-between gap-2 flex-col md:w-full md:pl-5">
                <div className="flex items-start flex-col leading-tight pb-2">
                  <h2 className="pt-0 text-left whitespace-pre-wrap">
                    {post.title ?? '글 제목 영역'}
                  </h2>

                  <span className="text-[0.875rem] text-gray-400 font-light whitespace-nowrap">
                    {post.createdAt ?? '작성일'}
                  </span>
                </div>
                <div className="relative leading-normal h-[4.2rem] overflow-hidden after:content-[''] after:bg-gradient-to-r after:from-[rgb(255,255,255,0)] after:to-[rgb(255,255,255,1)] after:p-3 after:pl-10 after:bottom-0 after:right-0 after:absolute after:-ml-10">
                  <span className=" md:text-[1rem] leading-slug text-[0.9rem] font-base ">
                    {post.description ?? ''}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
