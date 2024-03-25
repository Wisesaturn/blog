import { IPost } from '../types/post';
import { Tag } from '../types/article';

const DUMMY_POSTS: IPost[] = [
  {
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Technology',
    createdAt: '2022-01-01T12:00:00Z',
    description: 'This is a dummy post description.',
    index: '1',
    lastmod: '2022-01-01T12:00:00Z',
    last_editedAt: new Date(),
    plain_title: 'dummy-post-1',
    tags: [
      {
        color: '#ff0000',
        id: '1',
        name: 'Tag 1',
      },
      {
        color: '#00ff00',
        id: '2',
        name: 'Tag 2',
      },
    ] as Tag[],
    thumbnail: 'https://example.com/thumbnail1.jpg',
    title: 'Dummy Post 1',
    views: 100,
  },
  {
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Science',
    createdAt: '2022-01-02T12:00:00Z',
    description: 'This is another dummy post description.',
    index: '2',
    lastmod: '2022-01-02T12:00:00Z',
    last_editedAt: new Date(),
    plain_title: 'dummy-post-2',
    tags: [
      {
        color: '#0000ff',
        id: '3',
        name: 'Tag 3',
      },
    ] as Tag[],
    thumbnail: 'https://example.com/thumbnail2.jpg',
    title: 'Dummy Post 2',
    views: 150,
  },
];

export default DUMMY_POSTS;
