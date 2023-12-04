import { Link } from '@remix-run/react';

import type { IFirebasePostReturn } from '@Types/post';

export default function PostListSection(props: { data: IFirebasePostReturn[] }) {
  const { data } = props;

  return (
    <section className="isWrapper w-full flex-col gap-5 justify-between align-center md:flex-row">
      {data.map((post: IFirebasePostReturn) => {
        return (
          <Link
            prefetch="render"
            className="w-full"
            key={post.index}
            to={`${
              post.category
                ? `/${post.category}/${String(post.plain_title).replace(/\s+/g, '-')}`
                : `${String(post.plain_title).replace(/\s+/g, '-')}`
            }`}
          >
            <div className="hover:bg-gray-100 dark:hover:bg-[#191919] transition-colors hidden-blur p-1 rounded-lg flex flex-col justify-between gap-6 md:gap-8 relative md:flex-row">
              <div className="overflow-hidden flex flex-col md:w-full">
                <div className="flex justify-between">
                  <div className="flex gap-1 md:gap-3 md:flex-row flex-col">
                    <span className="text-xs md:text-sm flex gap-2">
                      <span className="text-green-main dark:text-green-brighter font-semibold rounded-md whitespace-nowrap">
                        {post.category.toUpperCase()}
                      </span>
                    </span>
                    <div className="hidden md:block">
                      <span className="text-xs md:text-sm flex gap-2 flex-wrap">
                        {post.tags.map((tag) => {
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
                  <span className="text-base font-semibold md:text-2xl leading-snug pt-1 w-full overflow-x-hidden text-ellipsis whitespace-nowrap">
                    <span>{post.title ?? '글 제목 영역'}</span>
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
