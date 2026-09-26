/**
 * PR 에 붙은 버전 레이블로 버전을 얼마나 올릴지 정한다 (#107).
 *
 * 워크플로에서 Node 로 바로 실행하므로 타입 제거만으로 돌아가는 문법만 쓴다(enum, namespace 금지).
 * 실행하면 `PR_LABELS`(레이블 이름 JSON 배열) 환경변수를 읽어 `GITHUB_OUTPUT` 에 `bump` 를 쓴다.
 */
import { appendFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export type BumpType = 'major' | 'minor' | 'patch' | 'none';

/** 버전 레이블. `/pr-convention` 이 PR 을 만들 때 이 중 하나를 붙인다 */
export const VERSION_LABELS = ['major', 'minor', 'patch'] as const;

/**
 * @description PR 레이블 중 버전 레이블을 찾아 올릴 자리를 돌려준다. 버전 레이블이 없으면 `none` 이다
 * @param labels PR 에 붙은 레이블 이름 전체
 * @returns 올릴 자리. 버전 레이블이 둘 이상이면 어느 쪽인지 알 수 없어 `null`
 * @example
 * getBumpType(['🔥 Hotfix', 'patch']); // 'patch'
 * getBumpType(['📃 Release']); // 'none'
 */
export function getBumpType(labels: string[]): BumpType | null {
  const found = VERSION_LABELS.filter((label) => labels.includes(label));
  if (found.length > 1) return null;
  return found[0] ?? 'none';
}

/* -------------------------------------------------------------------------------------------------
 * 워크플로에서 직접 실행할 때
 * -----------------------------------------------------------------------------------------------*/

// 실행 경로에 `..` 이나 심볼릭 링크가 끼어도 같은 파일로 보도록 실제 경로끼리 비교한다
const isDirectRun =
  !!process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const labels: string[] = JSON.parse(process.env.PR_LABELS ?? '[]');
  const bump = getBumpType(labels);

  if (!bump) {
    console.error(
      `::error::버전 레이블이 여러 개입니다: ${labels.join(', ')}. ${VERSION_LABELS.join(', ')} 중 하나만 붙입니다.`,
    );
    process.exit(1);
  }

  appendFileSync(process.env.GITHUB_OUTPUT ?? '/dev/stdout', `bump=${bump}\n`);
}
