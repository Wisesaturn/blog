export interface ITags {
  color: string;
  id: string;
  name: string;
}
export interface IPost {
  readonly title: string;
  readonly plain_title: string;
  readonly description?: string;
  readonly createdAt: string;
  readonly thumbnail: string;
  readonly index: number;
  readonly body: string;
  readonly count: number;
  readonly tags: ITags[];
  readonly comments: {
    readonly username: string;
    readonly password: string;
    readonly createdAt: string;
    readonly body: string;
  };
}

export interface INotionPostReturn {
  title: string;
  plain_title: string;
  createdAt: string;
  thumbnail: string;
  index: string;
  tags: string[];
  description: string;
}
