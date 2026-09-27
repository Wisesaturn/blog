import { describe, expect, it } from 'vitest';

import getStoragePaths from './getStoragePaths';

/**
 * `getStoragePaths` 는 발행이 끝난 뒤 옛 파일을 지울 때 남길 파일을 정한다.
 *
 * 여기서 경로를 하나라도 빠뜨리면, 방금 저장한 문서가 가리키는 이미지가 지워진다. 화면에는 에러 없이
 * 썸네일이나 본문 이미지만 깨지므로 조용히 실패한다. #104 에서 운영 글의 썸네일이 이렇게 사라졌다.
 */

const BASE = 'https://storage.googleapis.com/jaehan-flow.appspot.com';
const encode = (path: string) => `${BASE}/${encodeURIComponent(path)}`;

describe('getStoragePaths 는 Storage 주소를 파일 경로로 바꿔 모은다', () => {
  it('인코딩된 한글 경로를 Storage 의 fullPath 형식으로 푼다', () => {
    const url = encode('post/typescript/함수-타입-선언하기/cover-1790318020855.webp');

    expect(getStoragePaths(url)).toEqual(
      new Set(['post/typescript/함수-타입-선언하기/cover-1790318020855.webp']),
    );
  });

  it('썸네일과 본문 HTML 의 주소를 함께 모은다', () => {
    const thumbnail = encode('post/react/a/cover-1.webp');
    const body = `<p><img src="${encode('post/react/a/img-2.webp')}" alt=""></p><img src='${encode('post/react/a/img-3.gif')}'>`;

    expect(getStoragePaths(thumbnail, body)).toEqual(
      new Set(['post/react/a/cover-1.webp', 'post/react/a/img-2.webp', 'post/react/a/img-3.gif']),
    );
  });

  it('Storage 가 아닌 주소는 모으지 않는다', () => {
    const body =
      '<img src="https://user-images.githubusercontent.com/1/a.png"><a href="https://jaehan.blog/posts">x</a>';

    expect(getStoragePaths(body)).toEqual(new Set());
  });

  it('주소 뒤에 쿼리가 붙어 있으면 쿼리를 떼고 경로만 남긴다', () => {
    expect(getStoragePaths(`${encode('snippet/snippets/a/b.webp')}?alt=media`)).toEqual(
      new Set(['snippet/snippets/a/b.webp']),
    );
  });

  /**
   * `encodeURIComponent` 는 괄호를 인코딩하지 않아 주소에 `)` 가 그대로 남고, 정규식이 거기서 경로를 자른다.
   * 본문의 CSS `url(...)` 끝 괄호를 경로로 잡지 않으려고 둔 제외라 고치지 않는다.
   * 대신 `uploadImage` 가 `toStorageFileName` 으로 괄호를 뺀 이름으로 올린다 (#129)
   */
  it('괄호가 든 주소는 ) 앞에서 경로를 잘라 실제 경로와 달라진다', () => {
    const url = encode('project/team-projects/유클러버스/team_(1)-1.webp');

    expect(getStoragePaths(url)).toEqual(new Set(['project/team-projects/유클러버스/team_(1']));
  });

  it('CSS url() 로 감싼 주소는 끝 괄호를 빼고 경로를 모은다', () => {
    const body = `<div style="background: url(${encode('post/react/a/bg-1.webp')})"></div>`;

    expect(getStoragePaths(body)).toEqual(new Set(['post/react/a/bg-1.webp']));
  });

  it('잘린 퍼센트 인코딩은 건너뛰고 나머지 경로는 모은다', () => {
    const broken = `${BASE}/post%2Freact%2Fa%E0%A4`;
    const valid = encode('post/react/a/ok.webp');

    expect(getStoragePaths(broken, valid)).toEqual(new Set(['post/react/a/ok.webp']));
  });
});
