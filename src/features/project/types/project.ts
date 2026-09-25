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
    // 진행 중인 프로젝트는 Notion 에서 끝 날짜가 비어 있어 null 로 저장된다
    end: string | null;
  };
  website?: string | null;
  github?: string | null;
  views: number;
}
