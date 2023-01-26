export interface attributeTypes {
  readonly title: string;
  readonly date: string;
  readonly meta: {
    title: string;
    description?: string;
    imgSrc?: string;
  };
}

export interface postingTypes {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly body: string;
  readonly imgSrc: string;
}
