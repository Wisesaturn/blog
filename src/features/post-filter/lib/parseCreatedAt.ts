// 발행할 때 `Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' })` 로 저장해 값이 "2024. 5. 19." 형식이다.
// WebKit 은 이 형식을 `new Date()` 로 읽지 못하고 Invalid Date 를 돌려주므로 엔진의 파서를 거치지 않는다.
// 더미 데이터가 쓰는 ISO("2022-01-01T12:00:00Z")도 앞의 날짜 부분만 읽는다
const CREATED_AT_PATTERN = /^(\d{4})[.-]\s*(\d{1,2})[.-]\s*(\d{1,2})/;

/**
 * @description 글의 `createdAt` 문자열을 날짜로 읽는다. 브라우저마다 결과가 같도록 정규식으로 읽는다
 * @param createdAt "YYYY. M. D." 또는 "YYYY-MM-DD" 로 시작하는 문자열
 * @returns 그 날짜 0시(로컬 시간)의 Date. 형식이 맞지 않으면 Invalid Date
 * @example
 * parseCreatedAt('2024. 5. 19.'); // 2024-05-19 00:00 (로컬)
 */
export default function parseCreatedAt(createdAt: string): Date {
  const matched = CREATED_AT_PATTERN.exec(createdAt);
  if (!matched) return new Date(NaN);

  const [, year, month, day] = matched;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
