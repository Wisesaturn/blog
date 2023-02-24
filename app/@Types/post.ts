export interface postingTypes {
  readonly title: string;
  readonly description?: string;
  readonly createdAt: Date;
  readonly thumbnail: string;
  readonly index: number;
  readonly body: string;
  readonly tags: string[];
  readonly count: number;
  readonly comments: {
    readonly username: string;
    readonly password: string;
    readonly createdAt: string;
    readonly body: string;
  };
}
