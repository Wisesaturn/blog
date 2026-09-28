/**
 * Lucide `rss` (v1.48.0, ISC) 의 모양을 면으로 바꿔 그린 아이콘.
 *
 * Lucide 는 선(`stroke`)으로 그리지만, 아이콘 색은 `icons-color` 의 `fill` 클래스로 정해진다.
 * 그래서 두께 3 인 선을 같은 모양의 면으로 옮겼다. 호는 반지름 ±1.5 의 띠와 둥근 끝, 점은 반지름 2.5 의 원이다.
 * `viewBox` 는 그림 둘레에 3 만큼 여백을 둬서 옆의 푸터 아이콘과 크기를 맞췄다 (#140).
 */
export default function RssIcon(props: IconProps) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      className={props.className}
      viewBox="-1.5 -1.5 27 27"
      height="2rem"
      width="2rem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 9.5A10.5 10.5 0 0 1 14.5 20A1.5 1.5 0 0 1 11.5 20A7.5 7.5 0 0 0 4 12.5A1.5 1.5 0 0 1 4 9.5ZM4 2.5A17.5 17.5 0 0 1 21.5 20A1.5 1.5 0 0 1 18.5 20A14.5 14.5 0 0 0 4 5.5A1.5 1.5 0 0 1 4 2.5ZM5 16.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0 -5Z" />
    </svg>
  );
}
