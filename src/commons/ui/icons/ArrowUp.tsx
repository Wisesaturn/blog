/**
 * 위쪽 화살표. 예전에는 아래 화살표 경로에 바깥 `<svg>` 의 `transform="rotate(180)"` 을 걸어 뒤집었다.
 * 바깥 `<svg>` 의 transform 속성은 SVG 2 동작이라 Safari 가 무시해서 화살표가 아래를 향했다. 경로를 직접 위로 그린다.
 */
export default function ArrowUpIcon(props: IconProps) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      className={props.className}
      width="2rem"
      height="2rem"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m7 14l5-5l5 5"
      />
    </svg>
  );
}
