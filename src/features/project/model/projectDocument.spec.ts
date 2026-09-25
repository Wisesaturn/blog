/**
 * `projectMeta` 는 Firestore 에 이미 저장된 프로젝트 문서를 모두 받아야 한다.
 *
 * 2026-09-25 에 실제 문서 6건을 조사했을 때 `website` 는 4건에 필드 자체가 없고 1건이 null 이었다.
 * 진행 중인 프로젝트는 `date.end` 가 null 로 저장된다. 스키마가 이 중 하나라도 거부하면
 * 목록에서 그 프로젝트가 조용히 사라지므로, 받아야 하는 모양을 여기서 고정한다.
 */
import { describe, expect, it } from 'vitest';

import { projectMeta } from './projectDocument';

const META = {
  index: 'id',
  title: '🚀 유클러버스',
  plainTitle: '유클러버스',
  theme: '동아리 플랫폼',
  description: '설명',
  category: 'team',
  skills: ['React'],
  role: ['FE'],
  thumbnail: 'https://storage.googleapis.com/x.webp',
  date: { start: '2022-02-01', end: '2022-06-30' },
  github: 'https://github.com/x',
  website: 'https://x.io',
  createdAt: '2023. 1. 1.',
  lastEditedAt: '2023. 1. 1.',
  lastmod: '2023-01-01',
  views: 0,
};

describe('저장된 프로젝트 문서의 모양을 모두 받는다', () => {
  it.each([
    ['website 가 있다', META],
    ['website 가 null 이다', { ...META, website: null }],
    ['website 필드가 없다', (({ website: _website, ...rest }) => rest)(META)],
    ['진행 중이라 끝 날짜가 null 이다', { ...META, date: { start: '2024-01-01', end: null } }],
  ])('%s', (_, meta) => {
    expect(projectMeta.safeParse(meta).success).toBe(true);
  });
});
