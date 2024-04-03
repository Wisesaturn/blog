import { ServerRuntimeMetaArgs, ServerRuntimeMetaDescriptor } from '@remix-run/server-runtime';

import { IPost } from '$features/post/types/post';
import { IProject } from '$features/project/types/project';
import { DEFAULT_DESCRIPTION, DEFAULT_THUMBNAIL } from '$features/post/constant';

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

function isProject(obj: unknown): obj is { project: IProject } {
  return typeof obj === 'object' && obj !== null && 'project' in obj;
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
  let convertThumbnail = thumbnail || DEFAULT_THUMBNAIL;
  let convertDescription = description || DEFAULT_DESCRIPTION;
  let convertUrl = HOST_URL;

  // thumbnail
  if (isPost(data) && data.post.thumbnail) {
    convertThumbnail = data.post.thumbnail;
  } else if (isProject(data) && data.project.thumbnail) {
    convertThumbnail = data.project.thumbnail;
  }

  // description
  if (isPost(data) && data.post.description && data.post.tags) {
    convertDescription = `${data.post.description} | ${data.post.tags.map((tag) => tag).join(' ')}`;
  } else if (isProject(data) && data.project.description) {
    convertDescription = `${data.project.description}`;
  }

  // url
  if (params.category && params.title) {
    convertUrl = `${HOST_URL}/${params.category}/${convertTitle}`;
  } else if (params.category) {
    convertUrl = `${HOST_URL}/${params.category}`;
  } else if (params.title) {
    convertUrl = `${HOST_URL}/${convertTitle}`;
  }

  // metadata object
  const metadata = {
    title: convertTitle || '사툰사툰',
    description: convertDescription,
    url: convertUrl,
    thumbnail: convertThumbnail,
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
