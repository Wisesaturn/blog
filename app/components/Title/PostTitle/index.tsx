import { Image, remixImageLoader } from 'remix-image';

import thumbnailDefault from '@public/thumbnail.webp';

import type { ITags } from '@Types/post';
import type { PostTitleProps } from './types';

export default function PostTitle(props: PostTitleProps) {
  const { title, tags, createdAt, thumbnail } = props;

  const parsingTitle = title.split(':');
  const [mainTitle, subTitle] = parsingTitle;

  return (
    <section className="relative max-h-60 shadow-lg rounded-xl w-full max-w-layout mx-auto">
        <div className="relative text-white flex h-60 z-10 flex-col items-center justify-center">
          {subTitle && (<span className="bg-white rounded-xl px-4 py-0.5 text-[11px] mb-1 leading-4 md:leading-5 text-black font-bold md:text-[12px]">{subTitle}</span>)}
          <h2 className="text-[17px] md:text-[2rem] px-4 max-w-[290px] md:max-w-[700px] flex">
            <span className="text-gray-400">{'<'}</span>
            <span className="px-1 overflow-x-hidden text-ellipsis w-full whitespace-nowrap">
              <span>{mainTitle}</span>
            </span>
            <span className="text-gray-400">{'/>'}</span>
          </h2>
          <div className="flex items-center md:text-[0.875rem] text-[12px] justify-center flex-col">
            <div className="inline-block align-sub text-gray-300">{createdAt}</div>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-1 md:gap-3 whitespace-nowrap px-4">
              {tags.map((tag: ITags, idx: number) => {
                return (
                  <span className="text-gray-400 font-bold rounded-sm" key={idx}>
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
    </section>
  );
}
