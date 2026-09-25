import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

/**
 * @description 조회수 API 를 한 번 부르고, 응답이 오면 그 값을 조회수로 쓴다
 *
 * 상세 페이지는 CDN 에 캐시되므로 loader 가 준 조회수는 캐시된 시점의 값이다. 화면을 그린 뒤
 * API 를 불러 조회수를 올리고, 돌아온 최신 값으로 바꾼다. 응답이 오기 전과 실패했을 때는
 * loader 값을 그대로 보여 준다.
 *
 * `useFetcher` 로 부르면 action 뒤에 화면의 loader 가 모두 다시 돌아 상세 loader 가 Firestore 를
 * 또 읽는다. 그래서 TanStack Query 로 부른다. 쿼리 키가 글마다 달라서 다른 글로 옮기면 새로 부르고,
 * 같은 글로 돌아오면 캐시된 값을 쓴다.
 * @param query `postQueries.views` 같은 조회수 queryOptions
 * @param initialViews loader 가 준 조회수
 * @returns 지금 보여 줄 조회수
 * @example
 * const views = useViewCount(postQueries.views(category, title), post.views);
 */
export default function useViewCount<K extends readonly unknown[]>(
  query: UseQueryOptions<number | null, Error, number | null, K>,
  initialViews: number,
): number {
  const { data } = useQuery(query);
  return data ?? initialViews;
}
