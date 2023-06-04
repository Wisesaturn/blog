import React, { lazy, Suspense } from 'react';

import thumbnailDefault from '@public/thumbnail.webp';

import type { ITags } from '@Types/post';
import type { PostTitleProps } from './types';

export default function PostTitle(props: PostTitleProps) {
  const { title, tags, createdAt, thumbnail } = props;

  return (
    <section className="relative max-h-60 shadow-lg rounded-xl w-full max-w-layout mx-auto">
      <Suspense fallback={<>로딩 중...</>}>
        <div className="relative text-white flex h-60 z-10 flex-col gap-3 items-center justify-center">
          <h1>
            <span className="text-gray-400">{'<'}</span> {title}{' '}
            <span className="text-gray-400">{'/>'}</span>
          </h1>
          <div className="flex items-center text-[0.875rem] justify-center flex-col">
            <div className="font-light">{createdAt}</div>
            <div className="flex gap-3">
              {tags.map((tag: ITags) => {
                return (
                  <span className="text-gray-400 font-bold rounded-sm" key={createdAt}>
                    # {tag.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="top-0 bottom-0 absolute brightness-[0.25] bg-gray-100 animate-skeletonUI overflow-hidden rounded-xl w-full max-w-layout">
          <img
            loading="lazy"
            className="rounded-xl w-full h-full object-cover"
            alt="썸네일"
            src={thumbnail === '' ? thumbnailDefault : thumbnail}
          />
        </div>
      </Suspense>
    </section>
  );
}
