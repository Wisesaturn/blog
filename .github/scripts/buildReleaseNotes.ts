/**
 * 머지된 PR 로 GitHub 릴리즈 노트를 만든다 (#108).
 *
 * 워크플로에서 Node 로 바로 실행하므로 타입 제거만으로 돌아가는 문법만 쓴다(enum, namespace 금지).
 * 실행하면 환경변수 `PR_TITLE`, `PR_BODY`, `PR_NUMBER`, `VERSION`, `PREV_TAG`, `TAG_PREFIX`, `REPO` 를 읽어
 * `NOTES_FILE` 경로에 노트를 쓴다.
 */
import { realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface ReleaseNotesInput {
  /** PR 제목 (`fix: 요약`) */
  title: string;
  /** PR 본문 */
  body: string;
  prNumber: number;
  /** 이번 태그 (`v3.0.2`) */
  tag: string;
  /** 직전 태그. 없으면 Full Changelog 를 쓰지 않는다 */
  prevTag?: string;
  /** `owner/repo` */
  repo: string;
}

/** PR 제목 타입별 노트 섹션. v3.0.0, v3.0.1 노트와 같은 이름을 쓴다 */
const SECTION_BY_TYPE: Record<string, string> = {
  feat: 'Feature',
  fix: 'Fix',
};

/**
 * @description PR 제목의 타입으로 노트의 섹션 이름을 정한다. feat, fix 밖은 Etc 다
 * @param title PR 제목
 * @returns 섹션 이름
 */
export function getSection(title: string): string {
  const type = /^([a-z]+)!?:/.exec(title.trim())?.[1] ?? '';
  return SECTION_BY_TYPE[type] ?? 'Etc';
}

/**
 * @description PR 본문에서 `## 작업 내용` 절을 꺼낸다. 다음 `## ` 제목 앞까지다
 * @param body PR 본문
 * @returns 절 내용(제목 줄 제외). 절이 없거나 비었으면 `null`
 */
export function extractWorkSection(body: string): string | null {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((line) => /^##\s+작업 내용\s*$/.test(line));
  if (start === -1) return null;

  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^##\s/.test(line));
  const section = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
  return section || null;
}

/**
 * @description 작업 내용의 소제목을 노트 형식으로 바꾼다. `### 1. 제목` 의 번호를 떼고 끝에 `(#PR)` 을 붙인다
 * @param section 작업 내용 절
 * @param prNumber PR 번호
 * @returns 바꾼 절
 */
export function formatHeadings(section: string, prNumber: number): string {
  return section.replace(
    // \s 는 줄바꿈까지 먹어 소제목 뒤 빈 줄이 사라진다. 한 줄 안의 공백만 본다
    /^###[ \t]+(?:\d+\.[ \t]*)?(.+?)[ \t]*$/gm,
    (_, heading: string) => `### ${heading} (#${prNumber})`,
  );
}

/**
 * @description 머지된 PR 하나로 릴리즈 노트를 만든다. 작업 내용 절이 없으면 PR 제목 한 줄로 대신한다
 * @param input PR 과 태그 정보
 * @returns 노트 마크다운과, 작업 내용 절을 찾지 못했는지 여부
 * @example
 * buildReleaseNotes({ title: 'fix: 요약', body, prNumber: 105, tag: 'v3.0.2', prevTag: 'v3.0.1', repo: 'Wisesaturn/blog' });
 */
export function buildReleaseNotes(input: ReleaseNotesInput): { notes: string; fallback: boolean } {
  const { title, body, prNumber, tag, prevTag, repo } = input;
  const section = extractWorkSection(body);
  const summary = title.replace(/^[a-z]+!?:\s*/, '').trim();

  const content = section ? formatHeadings(section, prNumber) : `### ${summary} (#${prNumber})`;

  const parts = [`## ${getSection(title)}`, content];
  if (prevTag) {
    parts.push(`**Full Changelog**: https://github.com/${repo}/compare/${prevTag}...${tag}`);
  }

  return { notes: `${parts.join('\n\n')}\n`, fallback: !section };
}

/* -------------------------------------------------------------------------------------------------
 * 워크플로에서 직접 실행할 때
 * -----------------------------------------------------------------------------------------------*/

// 실행 경로에 `..` 이나 심볼릭 링크가 끼어도 같은 파일로 보도록 실제 경로끼리 비교한다
const isDirectRun =
  !!process.argv[1] &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const env = process.env;
  const { notes, fallback } = buildReleaseNotes({
    title: env.PR_TITLE ?? '',
    body: env.PR_BODY ?? '',
    prNumber: Number(env.PR_NUMBER),
    tag: `${env.TAG_PREFIX ?? 'v'}${env.VERSION}`,
    prevTag: env.PREV_TAG || undefined,
    repo: env.REPO ?? '',
  });

  if (fallback) {
    console.warn('::warning::PR 본문에 "## 작업 내용" 절이 없어 PR 제목으로 노트를 만들었습니다.');
  }
  writeFileSync(env.NOTES_FILE ?? '/dev/stdout', notes);
}
