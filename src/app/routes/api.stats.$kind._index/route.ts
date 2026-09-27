import { type LoaderFunctionArgs } from 'react-router';

import { statKind } from '@/entities/stats';
import { getStats } from '@/entities/stats/index.server';

/**
 * 한 종류(`post`, `snippet`, `project`)의 통계를 전부 돌려준다. 목록 화면이 한 번 불러 카드마다 숫자를 끼운다.
 *
 * 목록 페이지(HTML)는 캐시하지 않고 숫자 JSON 만 CDN 에 60초 둔다. 방문이 몰려도 Firestore 읽기가
 * 1분에 한 번으로 묶이고, 목록의 숫자는 최대 1분 늦는다.
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const kind = statKind.safeParse(params.kind);
  if (!kind.success) {
    return Response.json({ message: '모르는 종류입니다' }, { status: 404 });
  }

  try {
    return Response.json(await getStats(kind.data), {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    console.error(err);
    return Response.json({ message: '통계를 읽지 못했습니다' }, { status: 500 });
  }
}
