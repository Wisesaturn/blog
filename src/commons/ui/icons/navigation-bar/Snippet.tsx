/**
 * @access Only Use Navigation Bar
 */
export default function SnippetIcon(props: IconProps) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      className={props.className}
      height="2rem"
      width="2rem"
    >
      <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h10l6 6v10q0 .825-.587 1.413T19 21zm2-4h10v-2H7zm0-4h10v-2H7zm0-4h7V7H7z" />
    </svg>
  );
}
