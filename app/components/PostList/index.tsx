// eslint-disable-next-line import/no-unresolved

import { Link } from '@remix-run/react';

import type { IPost, ITags } from '@Types/post';

export default function PostCardSection(props: { data: IPost[] }) {
  const { data } = props;

  return (
    <section className="isWrapper w-full flex-col gap-5 justify-between align-center md:flex-row">
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
            <div className="hover:bg-gray-100 hidden-blur p-1 rounded-lg flex flex-col justify-between gap-6 md:gap-8 relative md:flex-row">
              <div className="overflow-hidden flex flex-col md:w-full">
                <div className="flex justify-between">
                  <div className="flex gap-1 md:gap-3 md:flex-row flex-col">
                    <span className="text-xs md:text-sm flex gap-2">
                      <span className="text-green-main font-semibold rounded-md whitespace-nowrap">
                        {post.category}
                      </span>
                    </span>
                    <div className="hidden md:block">
                      <span className="text-xs md:text-sm flex gap-2 flex-wrap whitespace-nowrap">
                        {post.tags.map((tag: ITags) => {
                          return (
                            <span className="text-gray-400 font-light rounded-md" key={tag.id}>
                              {'#'}
                              {tag.name}
                            </span>
                          );
                        })}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm font-light whitespace-nowrap">
                    {post.createdAt ?? '작성일'}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="leading-snug pt-1">{post.title ?? '글 제목 영역'}</h3>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
