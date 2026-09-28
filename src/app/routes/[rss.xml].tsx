import { getPosts } from '@/entities/post/index.server';

import { FEED_CACHE_CONTROL } from '@/commons/config/cache';
import { SITE_URL } from '@/commons/config/site';

import { DEFAULT_DESCRIPTION } from '../config/meta';
import { buildRssFeed } from '../lib/buildRssFeed';

/** 글(posts)만 넣은 RSS 2.0 피드 (#138). 스니펫과 프로젝트는 넣지 않는다 */
export const loader = async () => {
  const posts = await getPosts();
  const content = buildRssFeed({
    posts,
    siteUrl: SITE_URL,
    title: '사툰사툰',
    description: DEFAULT_DESCRIPTION,
  });

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': FEED_CACHE_CONTROL,
    },
  });
};
