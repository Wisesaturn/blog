/**
 * `toStorageFileName` 은 원본 이미지 주소에서 Storage 에 올릴 파일 이름을 만든다.
 *
 * 주소에 괄호 같은 문자가 그대로 남으면 `getStoragePaths` 가 경로를 잘못 잘라, 발행 직후 방금 올린
 * 이미지를 옛 파일로 보고 지운다. 응답은 200 이고 이미지만 깨지므로 조용히 실패한다 (#129).
 */
import { describe, expect, it } from 'vitest';

import toStorageFileName from './toStorageFileName';

const NOTION = 'https://prod-files-secure.s3.us-west-2.amazonaws.com/abc/def';
const src = (name: string) => `${NOTION}/${encodeURIComponent(name)}`;

describe('toStorageFileName 은 주소에서 확장자를 뗀 파일 이름을 꺼낸다', () => {
  it('쿼리와 확장자를 떼고 마지막 경로 조각만 남긴다', () => {
    expect(toStorageFileName(`${NOTION}/cover.png?X-Amz-Signature=1&X-Amz-Date=2`)).toBe('cover');
  });

  it('퍼센트 인코딩된 한글 이름을 푼다', () => {
    expect(toStorageFileName(src('유클러버스.png'))).toBe('유클러버스');
  });

  it('확장자가 없는 unsplash 주소는 경로 조각을 그대로 쓴다', () => {
    expect(toStorageFileName('https://images.unsplash.com/photo-123?ixlib=rb&fm=jpg')).toBe(
      'photo-123',
    );
  });

  /**
   * 첫 `.` 앞까지만 남긴다. 이름에 `.` 이 여럿이면 뒷부분이 사라지지만,
   * 뒤에 유닉스 시간이 붙어 파일이 겹치지 않으므로 그대로 둔다.
   */
  it('이름에 . 이 여럿이면 첫 . 앞까지만 남긴다', () => {
    expect(toStorageFileName(src('screen.shot.2026.png'))).toBe('screen');
  });
});

describe('toStorageFileName 은 파일 이름에 문자, 숫자, -, _ 만 남긴다', () => {
  it.each([
    ['괄호', 'ucluverse-team_(1).png', 'ucluverse-team_-1-'],
    ['공백', 'my image.png', 'my-image'],
    ['퍼센트', '100%done.png', '100-done'],
    ['주소 구분 문자', 'a#b?c&d.png', 'a-b-c-d'],
    ['작은따옴표', "it's.png", 'it-s'],
  ])('%s 를 - 로 바꾼다', (_name, name, expected) => {
    expect(toStorageFileName(src(name))).toBe(expected);
  });

  it('이어진 문자는 - 하나로 바꾼다', () => {
    expect(toStorageFileName(src('a (1) b.png'))).toBe('a-1-b');
  });

  it('한글, 영문, 숫자, -, _ 는 그대로 둔다', () => {
    expect(toStorageFileName(src('Character-hello_1790498354472-유클러버스.webp'))).toBe(
      'Character-hello_1790498354472-유클러버스',
    );
  });

  it('자모가 나뉜 한글도 합쳐서 그대로 둔다', () => {
    expect(toStorageFileName(src(`${'유클러버스'.normalize('NFD')}.png`))).toBe('유클러버스');
  });

  it('바꾼 이름은 encodeURIComponent 를 거쳐도 모양이 같다', () => {
    const name = toStorageFileName(src("team (1)'s #2 100%.png"));

    expect(decodeURIComponent(encodeURIComponent(name))).toBe(name);
    expect(encodeURIComponent(name)).not.toMatch(/[()'!*]/);
  });
});
