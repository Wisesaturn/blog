import getPosts from '@/features/post/api/getPosts';
import getProjects from '@/features/project/api/getProjects';
import getSnippets from '@/features/snippet/api/getSnippets';

import convertString from '@/commons/lib/convertString';

export interface ContentPath {
  /** 앞에 `/` 가 붙은 URL 경로. 한글은 인코딩하지 않은 그대로다 */
  path: string;
  lastmod?: string;
}

export interface ContentPaths {
  posts: ContentPath[];
  projects: ContentPath[];
  snippets: ContentPath[];
}

/**
 * @description 글과 프로젝트, 스니펫의 상세 페이지 경로를 모두 만든다. sitemap 과 `prerender` 가 같이 쓴다
 *
 * 경로의 마지막 조각은 Firestore 문서 id 와 같아야 한다. 발행할 때 id 를 `plain_title`(글)과
 * `plainTitle`(스니펫, 프로젝트)에 `spaceToDash` 를 적용해 만들므로 여기서도 같은 필드를 쓴다.
 *
 * 컬렉션에 `title` 없이 `reactions` 만 있는 유령 문서가 있다. 목록 조회 함수들이 문서 스키마로 걸러서
 * 넘겨 주므로 여기서는 다시 검사하지 않는다. 걸러지지 않으면 `convertString` 에서 에러가 발생해
 * sitemap 이 500 이 되고 빌드가 실패한다.
 * @returns 종류별 경로 목록
 */
export default async function getContentPaths(): Promise<ContentPaths> {
  const [posts, projects, snippets] = await Promise.all([getPosts(), getProjects(), getSnippets()]);

  const toPath = (prefix: string, plainTitle: string, lastmod: string): ContentPath => ({
    path: `${prefix}/${convertString(plainTitle, 'spaceToDash')}`,
    lastmod,
  });

  return {
    posts: posts.map((post) => toPath(`/posts/${post.category}`, post.plain_title, post.lastmod)),
    projects: projects.map((project) => toPath('/projects', project.plainTitle, project.lastmod)),
    snippets: snippets.map((snippet) => toPath('/snippets', snippet.plainTitle, snippet.lastmod)),
  };
}
