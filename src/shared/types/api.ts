import { IPost } from '$features/post/types/post';
import { IProject } from '$features/project/types/project';

interface ApiPostArticle {
  title: string;
}

interface ApiPostProject {
  title: string;
}

interface IPostBody {
  article: ApiPostArticle;
  project: ApiPostProject;
}

interface IPostResponse {
  article: IPost;
  project: IProject;
}

export type PostEndPoint = keyof IPostBody;
export type PostBody<T> = T extends keyof IPostBody ? IPostBody[T] : unknown;
export type PostResponse<T> = T extends keyof IPostResponse ? IPostResponse[T] : unknown;
