import { IPost } from '$features/post/types/post';
import { IProject } from '$features/project/types/project';
import { ISnippet } from '$features/snippet/types/snippet';

interface ApiPostArticle {
  title: string;
}

interface ApiPostProject {
  title: string;
}

interface ApiPostSnippet {
  title: string;
}

interface IPostBody {
  snippet: ApiPostSnippet;
  article: ApiPostArticle;
  project: ApiPostProject;
}

interface IPostResponse {
  article: IPost;
  project: IProject;
  snippet: ISnippet;
}

export type PostEndPoint = keyof IPostBody;
export type PostBody<T> = T extends keyof IPostBody ? IPostBody[T] : unknown;
export type PostResponse<T> = T extends keyof IPostResponse ? IPostResponse[T] : unknown;
