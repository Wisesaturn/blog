export interface postingTypes {
  readonly title: string;
  readonly created: {
    seconds: number;
    nanoseconds: number;
  };
  readonly thumbnail: string;
  readonly index: number;
  readonly body: string;
  readonly tags: string[];
  readonly count: number;
}
