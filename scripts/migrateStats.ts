/**
 * 콘텐츠 문서의 조회수(`views`)와 Notion 페이지 ID(`index`)를 `stats/{kind}:{key}` 문서로 옮긴다 (#117).
 *
 * 실행 (기본은 dry-run: 읽기만 하고 옮길 목록과 합계를 출력한다)
 *   set -a && . ./.env && set +a
 *   pnpm exec vite-node --config scripts/vite-node.config.ts scripts/migrateStats.ts
 *   pnpm exec vite-node --config scripts/vite-node.config.ts scripts/migrateStats.ts -- --write
 *
 * - 콘텐츠 문서의 `views` 는 지우지 않는다. 새 코드가 읽지 않을 뿐이라 되돌릴 수 있다
 * - `setDoc(merge)` 로 `views` 와 `notionPageId` 만 쓴다. 이미 있는 `likes` 는 건드리지 않는다
 * - 같은 값을 다시 써도 결과가 같아 여러 번 돌려도 된다. 배포 직전에 한 번 더 돌려 그사이 오른 조회수를 맞춘다
 *   (배포 뒤에 돌리면 새 코드가 stats 에 올린 조회수를 옛 값으로 덮으므로, 배포 뒤에는 돌리지 않는다)
 * - 문서 ID 는 API 와 같은 `toStatId` 로 만든다
 */
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { PRODUCTION_CATEGORY_DATA } from '@/entities/post';
import { PROJECTS_DATA } from '@/entities/project';
import { toStatId, type StatKind } from '@/entities/stats';

import { db } from '@/commons/api/firebase.server';

interface Row {
  kind: StatKind;
  key: string;
  views: number;
  notionPageId?: string;
}

const readViews = (data: Record<string, unknown>) =>
  typeof data.views === 'number' ? data.views : 0;
const readIndex = (data: Record<string, unknown>) =>
  typeof data.index === 'string' ? data.index : undefined;

/** 유령 문서(`reactions` 만 있는 문서)는 콘텐츠가 아니라 뺀다. 목록 API 의 스키마 검사와 같은 기준이다 */
const isContent = (data: Record<string, unknown>) => typeof data.title === 'string';

async function collectRows(): Promise<Row[]> {
  const posts = await Promise.all(
    PRODUCTION_CATEGORY_DATA.map(async ({ link }) => {
      const snap = await getDocs(collection(db, link));
      return snap.docs
        .filter((d) => isContent(d.data()))
        .map((d) => ({
          kind: 'post' as const,
          key: `${link}/${d.id}`,
          views: readViews(d.data()),
          notionPageId: readIndex(d.data()),
        }));
    }),
  );

  const snippetSnap = await getDocs(collection(db, 'snippets'));
  const snippets = snippetSnap.docs
    .filter((d) => isContent(d.data()))
    .map((d) => ({
      kind: 'snippet' as const,
      key: d.id,
      views: readViews(d.data()),
      notionPageId: readIndex(d.data()),
    }));

  const projects = await Promise.all(
    PROJECTS_DATA.map(async ({ name }) => {
      const snap = await getDocs(collection(db, 'projects', name, 'meta'));
      const meta = snap.docs[0]?.data();
      return meta && isContent(meta)
        ? [
            {
              kind: 'project' as const,
              key: name,
              views: readViews(meta),
              notionPageId: readIndex(meta),
            },
          ]
        : [];
    }),
  );

  return [...posts.flat(), ...snippets, ...projects.flat()];
}

async function main() {
  const write = process.argv.includes('--write');
  const rows = await collectRows();

  console.warn(`${write ? '[WRITE]' : '[DRY-RUN]'} ${rows.length}개`);
  rows.forEach((r) =>
    console.warn(
      `  ${toStatId({ kind: r.kind, key: r.key }).padEnd(70)} views=${String(r.views).padStart(5)} page=${r.notionPageId ?? '(없음)'}`,
    ),
  );
  (['post', 'snippet', 'project'] as const).forEach((kind) => {
    const list = rows.filter((r) => r.kind === kind);
    console.warn(
      `  합계 ${kind}: ${list.length}개, views ${list.reduce((sum, r) => sum + r.views, 0)}`,
    );
  });

  if (!write) {
    console.warn('쓰지 않았습니다. 옮기려면 -- --write 를 붙여 다시 돌립니다.');
    return;
  }

  await Promise.all(
    rows.map((r) =>
      setDoc(
        doc(db, 'stats', toStatId({ kind: r.kind, key: r.key })),
        {
          kind: r.kind,
          key: r.key,
          views: r.views,
          ...(r.notionPageId ? { notionPageId: r.notionPageId } : {}),
        },
        { merge: true },
      ),
    ),
  );
  console.warn(`${rows.length}개를 stats 에 썼습니다.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
