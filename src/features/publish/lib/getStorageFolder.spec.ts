/**
 * `getStorageFolder` 는 `uploadImage` 가 이미지를 올리고 `deleteStore` 가 옛 파일을 지우는 폴더를 정한다.
 *
 * 제목에 괄호가 들어간 글은 폴더 이름에 괄호가 남아, 발행할 때마다 그 글의 썸네일과 본문 이미지가 모두 지워졌다 (#131).
 * 올린 파일의 주소에서 `getStoragePaths` 가 꺼낸 경로가 실제 경로와 같아야 `deleteStore` 가 새 파일을 남긴다.
 */
import { describe, expect, it } from 'vitest';

import getStorageFolder from './getStorageFolder';
import getStoragePaths from './getStoragePaths';

const MFE = {
  collection: 'post',
  category: 'frontend',
  title: '쌩-npm으로-MFE-구축하기-(1)-:-개념',
};

describe('getStorageFolder 는 collection/category/title 폴더 경로를 만든다', () => {
  it('제목의 괄호와 콜론을 - 로 바꾼다', () => {
    expect(getStorageFolder(MFE)).toBe('post/frontend/쌩-npm으로-MFE-구축하기-1-개념');
  });

  it('안전한 제목은 그대로 쓴다', () => {
    expect(
      getStorageFolder({ collection: 'project', category: 'team-projects', title: '유클러버스' }),
    ).toBe('project/team-projects/유클러버스');
  });

  it('올린 파일의 주소에서 꺼낸 경로가 실제 경로와 같다', () => {
    const fullPath = `${getStorageFolder(MFE)}/thumbnail-mfe-1790488653891.webp`;
    const url = `https://storage.googleapis.com/jaehan-flow.appspot.com/${encodeURIComponent(fullPath)}`;

    expect(getStoragePaths(url)).toEqual(new Set([fullPath]));
  });
});
