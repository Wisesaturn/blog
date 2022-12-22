export interface parsingTypes {
  date: string;
  meta: {
    title: string;
    description?: string;
  };
}

export interface postingTypes {
  slug: string;
  title: string;
  description: string;
  date: string;
}
