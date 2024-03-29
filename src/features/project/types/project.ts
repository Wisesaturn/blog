type ProjectCategory = 'team' | 'personal';

export interface IProject {
  index: string;
  title: string;
  theme: string;
  plainTitle: string;
  description: string;
  body: string;
  category: ProjectCategory;
  createdAt: string;
  lastEditedAt: Date | string;
  lastmod: string;
  skills: string[];
  role: string[];
  thumbnail: string;
  date: string;
  github: string;
  views: number;
}
