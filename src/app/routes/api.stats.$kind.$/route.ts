import { type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router';

import { countView } from '@/features/view-count';

import { CATEGORY_DATA } from '@/entities/post';
import { likeRequest, parseStatPath, statKind, type StatKind } from '@/entities/stats';
import {
  getStat,
  increaseLikes,
  increaseViews,
  isMissingStat,
} from '@/entities/stats/index.server';

const NO_STORE = { 'Cache-Control': 'no-store' };

const notFound = () =>
  Response.json({ message: '없는 콘텐츠입니다' }, { status: 404, headers: NO_STORE });

/** 브라우저는 5xx 를 잠깐의 실패로 보고 다시 보낸다. 404 와 섞으면 누른 좋아요를 버린다 */
const serverError = () =>
  Response.json({ message: '통계를 쓰지 못했습니다' }, { status: 500, headers: NO_STORE });

/**
 * `/api/stats/:kind/{콘텐츠 키}[/동작]` 을 콘텐츠 키와 동작으로 읽는다.
 *
 * 글 키의 카테고리는 컬렉션 이름이라, 목록에 있는 카테고리가 아니면 받지 않는다.
 * 개발 전용 카테고리는 `CATEGORY_DATA` 에 개발 환경에서만 들어 있다.
 */
function readTarget(params: LoaderFunctionArgs['params']) {
  const parsedKind = statKind.safeParse(params.kind);
  if (!parsedKind.success) return null;

  const kind = parsedKind.data;
  const parsed = parseStatPath({ kind, splat: params['*'] ?? '' });
  if (!parsed) return null;
  if (kind === 'post' && !CATEGORY_DATA.some((c) => c.link === parsed.key.split('/')[0])) {
    return null;
  }
  return { kind, ...parsed };
}

/** 콘텐츠 하나의 `{ views, likes }`. 사람마다 다르지 않지만 늘 최신이어야 해 캐시하지 않는다 */
export async function loader({ params }: LoaderFunctionArgs) {
  const target = readTarget(params);
  if (!target || target.operation) return notFound();

  try {
    return Response.json(await getStat({ kind: target.kind, key: target.key }), {
      headers: NO_STORE,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ message: '통계를 읽지 못했습니다' }, { status: 500, headers: NO_STORE });
  }
}

/** `POST …/view`: 조회수를 1 올린다. 같은 사람이 30분 안에 다시 부르면 올리지 않고 지금 값만 준다 */
async function view(request: Request, kind: StatKind, key: string) {
  const { views, setCookie } = await countView({
    request,
    kind,
    key,
    increase: () => increaseViews({ kind, key }),
    read: async () => (await getStat({ kind, key })).views,
  });
  return Response.json({ views }, { headers: { ...NO_STORE, 'Set-Cookie': setCookie } });
}

/**
 * `POST …/like`: 본문 `{ count }` 만큼 좋아요를 올린다 (#120). 브라우저가 쓰로틀로 모은 클릭 수다.
 * 사람을 식별하지 않아 누를 수 있는 횟수에 제한이 없다. `count` 만 1~100 으로 막는다
 */
async function like(request: Request, kind: StatKind, key: string) {
  const body = likeRequest.safeParse(await request.json().catch(() => null));
  if (!body.success) {
    return Response.json(
      { message: 'count 는 1~100 의 정수입니다' },
      { status: 400, headers: NO_STORE },
    );
  }
  const likes = await increaseLikes({ kind, key, count: body.data.count });
  if (likes === null) return notFound();
  return Response.json({ likes }, { headers: NO_STORE });
}

/**
 * `POST …/view`, `POST …/like`. 통계 문서가 없는 키는 404 다. 공개 API 라 없는 키로 문서를 만들지 않는다.
 * 그 밖의 실패는 500 이다. 브라우저가 404 는 버리고 500 은 다시 보내므로 둘을 섞지 않는다
 */
export async function action({ request, params }: ActionFunctionArgs) {
  const target = readTarget(params);
  if (request.method !== 'POST' || !target?.operation) return notFound();

  const { kind, key, operation } = target;
  try {
    return operation === 'view' ? await view(request, kind, key) : await like(request, kind, key);
  } catch (err) {
    if (isMissingStat(err)) return notFound();
    console.error(err);
    return serverError();
  }
}
