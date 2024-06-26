interface BadgeProps {
  children: string;
}

/**
 * @summary Badge 모양의 컴포넌트
 * @param props
 * @returns
 */
export default function Badge(props: BadgeProps) {
  const { children } = props;
  return (
    <span className="text-sm max-md:text-xs whitespace-nowrap text-gray-700 dark:text-gray-200 py-1 px-2.5 rounded-full bg-gray-200 dark:bg-gray-700">
      {children}
    </span>
  );
}
