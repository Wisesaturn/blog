import { ServerRuntimeMetaArgs, ServerRuntimeMetaDescriptor } from '@remix-run/server-runtime';

import { IPost } from '$features/post/types/post';

import { CATEGORY_DATA } from '$shared/constant/category';

interface HeadTagFormat extends ServerRuntimeMetaArgs {
  title?: string;
  description?: string;
  thumbnail?: string;
  urlPrefix?: string;
}

// Type Guard
function isPost(obj: unknown): obj is { post: IPost } {
  return typeof obj === 'object' && obj !== null && 'post' in obj;
}

/**
 * @summary meta tag 및 link tag 포맷을 추출하는 함수
 * @returns
 */
export default function formatHeadTags(props: HeadTagFormat): ServerRuntimeMetaDescriptor[] {
  const { title, description, urlPrefix, thumbnail, ...args } = props;
  const { data, params } = args;

  // calculate data
  const HOST_URL = `https://jaehan.blog/${urlPrefix || ''}`;
  const convertTitle = params.title ? params.title : title;
  const convertDescription =
    isPost(data) && data.post.description && data.post.tags
      ? `${data.post.description} | ${data.post.tags.map((tag) => tag).join(' ')}`
      : description;
  const convertThumbnail = isPost(data) && data.post.thumbnail ? data.post.thumbnail : thumbnail;
  let convertUrl = HOST_URL;

  if (params.category) {
    if (params.title) {
      convertUrl = `${HOST_URL}/${params.category}/${convertTitle}`;
    } else {
      convertUrl = `${HOST_URL}/${params.category}`;
    }
  }

  // metadata object
  const metadata = {
    title: convertTitle || '사툰사툰',
    description:
      convertDescription ||
      `꾸준히 성장하고 싶은 프론트엔드 엔지니어입니다. 저만의 경험과 기록을 담아두었습니다 | Error ${CATEGORY_DATA.map(
        (category) => category.name,
      ).join(' ')}`,
    url: convertUrl,
    thumbnail:
      convertThumbnail ||
      'https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png',
  };

  return [
    {
      title: metadata.title,
    },
    {
      name: 'thumbnail',
      content: metadata.thumbnail,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: metadata.url,
    },
    {
      name: 'description',
      content: metadata.description,
    },
    {
      property: 'og:url',
      content: metadata.url,
    },
    {
      property: 'og:title',
      content: metadata.title,
    },
    {
      property: 'og:image',
      content: metadata.thumbnail,
    },
    {
      property: 'og:description',
      content: metadata.description,
    },
    {
      name: 'twitter:url',
      content: metadata.url,
    },
    {
      name: 'twitter:title',
      content: metadata.title,
    },
    {
      property: 'twitter:image',
      content: metadata.thumbnail,
    },
    {
      name: 'twitter:description',
      content: metadata.description,
    },
    // social media : og graph
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'ko_KR' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    // only X (before twitter)
    { name: 'twitter:card', content: 'summary' },
  ];
}
