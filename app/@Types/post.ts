export interface ITags {
  color: string;
  id: string;
  name: string;
}

export interface IFirebasePostReturn {
  body: string;
  category: string;
  createdAt: string;
  description: string;
  index: string;
  last_editedAt: Date;
  plain_title: string;
  tags: string[];
  thumbnail: string;
  title: string;
  views: number;
}
