import { ApiError } from '@/commons/api/requestJson';

/**
 * @description 좋아요 요청의 실패를 다시 보낼지 가린다
 *
 * - 네트워크 오류: 요청이 서버에 닿지 않았을 수 있어 다시 보낸다
 * - 5xx, 429: 잠깐의 실패로 보고 다시 보낸다
 * - 그 밖의 4xx: 다시 보내도 같다 (없는 콘텐츠의 404, 잘못된 `count` 의 400)
 * - 응답 모양이 스키마와 다름(zod 에러): 서버는 이미 올린 뒤라 다시 보내면 두 번 오른다
 * @param error `postLike` 가 던진 에러
 * @returns 다시 보낼지
 * @example
 * createLikeBatcher({ send, onSent, onChange, shouldRetry: isRetryable });
 */
export default function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError) return error.status === 429 || error.status >= 500;
  return error instanceof TypeError;
}
