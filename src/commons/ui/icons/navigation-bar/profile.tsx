/**
 * @access Only Use Navigation Bar
 */
export default function ProfileIcon(props: IconProps) {
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
      <path
        fillRule="evenodd"
        d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z"
        clipRule="evenodd"
      />
    </svg>
  );
}
