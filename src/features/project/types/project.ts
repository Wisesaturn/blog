export interface IProject {
  index: string;
  title: string;
  plainTitle: string;
  theme: string;
  description: string;
  body: string;
  category: string;
  createdAt: string;
  lastEditedAt: Date | string;
  lastmod: string;
  skills: string[];
  role: string[];
  thumbnail: string;
  date: {
    start: string;
    end: string;
  };
  github: string;
  views: number;
}
