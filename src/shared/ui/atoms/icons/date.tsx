export default function DateIcon(props: IconProps) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      className={props.className}
      viewBox="0 0 24 24"
      height="2rem"
      width="2rem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M2 9c0-1.886 0-2.828.586-3.414C3.172 5 4.114 5 6 5h12c1.886 0 2.828 0 3.414.586C22 6.172 22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9m0 9c0 1.886 0 2.828.586 3.414C3.172 22 4.114 22 6 22h12c1.886 0 2.828 0 3.414-.586C22 20.828 22 19.886 22 18v-5c0-.471 0-.707-.146-.854C21.707 12 21.47 12 21 12H3c-.471 0-.707 0-.854.146C2 12.293 2 12.53 2 13z" />
        <path strokeLinecap="round" strokeWidth="2" d="M7 3v3m10-3v3" />
      </g>
    </svg>
  );
}
