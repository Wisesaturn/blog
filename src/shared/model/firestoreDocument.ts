import { type DocumentData } from 'firebase/firestore';
import { z } from 'zod';

/**
 * Firestore 에서 읽은 문서를 도메인 스키마로 검사한다.
 *
 * Firestore 는 스키마가 없어서 문서 모양이 저장한 쪽 코드에 달려 있다. 실제로 글 컬렉션에는
 * `reactions` 만 있는 유령 문서가 있고, 프로젝트에는 `website` 가 없는 문서와 null 인 문서가 섞여 있다.
 * 예전에는 `doc.data() as IPost` 로 단언해서 이런 문서가 화면이나 sitemap 까지 흘러가 터졌다.
 */

interface FirestoreDocument {
  ref: { path: string };
  data: () => DocumentData | undefined;
}

const MISSING = '없음';

/** 필드가 아예 없을 때 zod 기본 메시지 대신 짧은 표시를 남긴다. 유령 문서는 필드가 전부 없어서 로그가 길어진다 */
const parseOptions = {
  error: (issue: { input?: unknown }) => (issue.input === undefined ? MISSING : undefined),
};

const describeIssues = (error: z.ZodError) => {
  const pathOf = (issue: z.core.$ZodIssue) => issue.path.join('.') || '(문서)';
  const missing = error.issues.filter((issue) => issue.message === MISSING).map(pathOf);
  const invalid = error.issues
    .filter((issue) => issue.message !== MISSING)
    .map((issue) => `${pathOf(issue)}: ${issue.message}`);

  return [...(missing.length ? [`없는 필드 ${missing.join(', ')}`] : []), ...invalid].join(' / ');
};

/**
 * @description 목록으로 읽은 문서를 검사하고, 스키마와 맞지 않는 문서는 경고를 남기고 건너뛴다
 * @param schema 도메인 문서 스키마
 * @param docs `getDocs` 로 읽은 문서들
 * @returns 검사를 통과한 문서의 값. 스키마에 없는 필드(`reactions` 등)는 빠진다
 *
 * 목록 하나 때문에 페이지 전체나 sitemap 이 실패하지 않도록 건너뛴다.
 */
export function parseDocuments<S extends z.ZodType>(
  schema: S,
  docs: FirestoreDocument[],
): z.output<S>[] {
  return docs.flatMap((doc) => {
    const result = schema.safeParse(doc.data(), parseOptions);
    if (result.success) return [result.data];
    console.warn(
      `${doc.ref.path} 문서가 스키마와 달라 건너뜁니다: ${describeIssues(result.error)}`,
    );
    return [];
  });
}

/**
 * @description 한 건으로 읽은 문서를 검사한다
 * @param schema 도메인 문서 스키마
 * @param doc `getDoc` 등으로 읽은 문서. 존재하는지는 부르는 쪽이 먼저 확인한다
 * @returns 검사를 통과한 문서의 값
 * @throws 스키마와 다르면 문서 경로와 어긋난 필드를 적은 에러
 */
export function parseDocument<S extends z.ZodType>(schema: S, doc: FirestoreDocument): z.output<S> {
  const result = schema.safeParse(doc.data(), parseOptions);
  if (!result.success) {
    throw new Error(`${doc.ref.path} 문서가 스키마와 다릅니다: ${describeIssues(result.error)}`);
  }
  return result.data;
}
