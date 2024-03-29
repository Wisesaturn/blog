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

export type PostEndPoint = keyof IPostBody;
export type PostBody<T> = T extends keyof IPostBody ? IPostBody[T] : unknown;
