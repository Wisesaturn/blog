import { describe, expect, it } from 'vitest';

import { getBumpType } from './getBumpType';

/**
 * `getBumpType` 은 PR 레이블로 v3 머지 때 나갈 버전을 정한다.
 *
 * 여기서 틀리면 체크는 통과하는데 버전만 잘못 오른다. 기능 추가가 patch 로 나가거나, 문서 수정이
 * 운영 버전을 올리는 식으로 조용히 틀린다. 푸터와 릴리즈 태그가 이 값을 그대로 쓴다.
 */

describe('getBumpType 은 PR 의 버전 레이블로 올릴 자리를 정한다', () => {
  it.each([
    [['patch'], 'patch'],
    [['minor'], 'minor'],
    [['major'], 'major'],
  ])('%j 레이블이면 %s', (labels, bump) => {
    expect(getBumpType(labels)).toBe(bump);
  });

  it('다른 레이블이 함께 있어도 버전 레이블만 본다', () => {
    expect(getBumpType(['🔥 Hotfix', 'patch', '✨ Fix'])).toBe('patch');
  });

  it.each([[[]], [['📃 Release', '♻️ Refactor']]])(
    '버전 레이블이 없는 %j 는 none 이라 버전을 올리지 않는다',
    (labels) => {
      expect(getBumpType(labels)).toBe('none');
    },
  );

  it('버전 레이블이 둘 이상이면 어느 쪽인지 알 수 없어 null 이다', () => {
    expect(getBumpType(['patch', 'minor'])).toBeNull();
  });

  it('레이블 이름은 정확히 같아야 한다. Patch 나 앞뒤 공백은 버전 레이블이 아니다', () => {
    expect(getBumpType(['Patch', ' minor'])).toBe('none');
  });
});
