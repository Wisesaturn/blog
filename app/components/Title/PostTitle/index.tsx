import React, { Suspense } from 'react';
import { AiFillEye } from 'react-icons/ai';
import { Image, remixImageLoader } from 'remix-image';

import thumbnailDefault from '@public/thumbnail.webp';
import thumbnailBlur from '@public/gray.png';

import type { ITags } from '@Types/post';
import type { PostTitleProps } from './types';

export default function PostTitle(props: PostTitleProps) {
  const { title, tags, createdAt, thumbnail } = props;

  return (
    <section className="relative max-h-60 shadow-lg rounded-xl w-full max-w-layout mx-auto">
      <Suspense fallback={<>로딩 중...</>}>
        <div className="relative text-white flex h-60 z-10 flex-col items-center justify-center">
          <h2 className="whitespace-nowrap md:text-[2rem]">
            <span className="text-gray-400">{'<'}</span> {title}{' '}
            <span className="text-gray-400">{'/>'}</span>
          </h2>
          <div className="flex items-center text-[0.875rem] justify-center flex-col">
            <div className="inline-block align-sub text-gray-300">{createdAt}</div>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2 whitespace-nowrap">
              {tags.map((tag: ITags, idx: number) => {
                return (
                  <span className="text-gray-400 font-bold md:text-sm text-xs rounded-sm" key={idx}>
                    # {tag.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="top-0 bottom-0 absolute brightness-[0.25] bg-gray-100 animate-skeletonUI overflow-hidden rounded-xl w-full max-w-layout">
          <Image
            loader={remixImageLoader}
            blurDataURL={thumbnail === '' ? thumbnailDefault : thumbnail}
            className="rounded-xl w-full h-full object-cover"
            placeholder="blur"
            alt="Thumbnail"
            key={thumbnail === '' ? thumbnailDefault : thumbnail}
            src={thumbnail === '' ? thumbnailDefault : thumbnail}
            dprVariants={[1, 3]}
          />
        </div>
      </Suspense>
    </section>
  );
}
