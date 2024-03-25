interface ApiPostCreate {
  title: string;
}

interface IPostBody {
  create: ApiPostCreate;
}

export type PostEndPoint = 'create';
export type PostBody<T> = T extends 'create' ? IPostBody['create'] : unknown;
