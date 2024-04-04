export interface ISnippet {
  index: string;
  createdAt: string;
  lastEditedAt: Date | string;
  lastmod: string;
  title: string;
  plainTitle: string;
  skills: string[];
  description: string;
  views: number;
  body: string;
}
