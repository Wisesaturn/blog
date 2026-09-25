interface ChipProps {
  emoji: string;
  label: string;
  count: number;
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export default function Chip({ emoji, label, count, isActive, isLoading, onClick }: ChipProps) {
  const baseClass =
    'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all duration-150 hover:cursor-pointer';
  const activeClass = isActive
    ? 'border-green-main bg-green-main text-white dark:border-green-brighter dark:bg-green-darker'
    : 'border-gray-300 bg-white text-gray-700 hover:border-green-main dark:border-gray-600 dark:bg-transparent dark:text-gray-300 dark:hover:border-green-brighter';
  const loadingClass = isLoading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      disabled={isLoading}
      onClick={onClick}
      className={`${baseClass} ${activeClass} ${loadingClass}`}
    >
      <span>{emoji}</span>
      {count > 0 && <span className="font-medium">{count}</span>}
    </button>
  );
}
