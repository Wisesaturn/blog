/**
 * @access Only Use Navigation Bar
 */
export default function PostIcon(props: IconProps) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="2rem"
      height="2rem"
      viewBox="0 0 24 24"
    >
      <path d="M19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21M6 14h12v-2H6zm0 3h12v-1.5H6z" />
    </svg>
  );
}
