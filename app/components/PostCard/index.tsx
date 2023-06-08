// eslint-disable-next-line import/no-unresolved

import { Link } from '@remix-run/react';

import thumbnailDefault from '@public/thumbnail.webp';

import type { IPost, ITags } from '@Types/post';

export default function PostCardSection(props: { data: IPost[] }) {
  const { data } = props;

  return (
    <section className="isWrapper w-full flex-col gap-10 justify-between align-center md:flex-row">
      {data.map((post: IPost) => {
        return (
          <Link
            prefetch="render"
            className="w-full"
            reloadDocument
            key={post.index}
            to={`${
              post.category
                ? `/${post.category}/${String(post.plain_title).replace(/\s+/g, '-')}`
                : `${String(post.plain_title).replace(/\s+/g, '-')}`
            }`}
          >
            <div className="hover:bg-gray-100 hidden-blur p-2 rounded-lg flex flex-col justify-between gap-6 md:gap-8 relative md:flex-row md:h-40">
              <div className="rounded-lg w-full aspect-video md:h-auto overflow-hidden shadow-md shadow-gray-300 md:w-1/2">
                <img
                  className="bg-gray-100 animate-skeletonUI rounded-lg w-full h-full object-cover"
                  alt="썸네일"
                  src={post.thumbnail === '' ? thumbnailDefault : post.thumbnail}
                />
              </div>
              <div className="overflow-hidden flex justify-between gap-2 flex-col md:w-full md:pl-5">
                <div className="flex justify-between items-start">
                  <h2 className="pt-0 md:before:content-['*'] md:before:pr-2 md:leading-none md:pb-2 md:before:text-red-300 md:before:absolute md:before:-translate-x-4 md:before:translate-y-0.5">
                    {post.title ?? '글 제목 영역'}
                  </h2>
                  <span className="text-[0.875rem] font-light">{post.createdAt ?? '작성일'}</span>
                </div>
                <div className="relative h-[4.5rem] overflow-hidden after:content-[''] after:bg-gradient-to-r after:from-[rgb(255,255,255,0)] after:to-[rgb(255,255,255,1)] after:p-3 after:pl-10 after:bottom-5 md:after:bottom-0 after:right-0 after:absolute after:-ml-10">
                  <span className=" md:text-[1rem] text-[0.9rem] font-light whitespace-pre-line">
                    {post.description ?? ''}
                  </span>
                </div>
                <span className="text-[0.75rem] font-light flex flex-wrap gap-2 md:inline-block md:space-x-2 md:space-y-2 md:whitespace-nowrap">
                  {post.tags.map((tag: ITags) => {
                    return (
                      <span
                        className="inline-block py-0.5 px-2 text-black bg-gray-200 font-bold rounded-md"
                        key={tag.id}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
