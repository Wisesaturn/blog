import { cn } from '@/commons/lib';

interface StatCountProps {
  /** 보여 줄 숫자. `undefined` 는 받는 중, `null` 은 받지 못함 */
  value: number | null | undefined;
  /** 스크린리더가 읽을 이름 (예: 조회수) */
  label: string;
  className?: string;
}

/* -------------------------------------------------------------------------------------------------
 * StatCount
 * 조회수, 좋아요 수처럼 페이지를 그린 뒤 API 로 받는 숫자. 받는 중에는 같은 자리에 작은 skeleton 을
 * 두어 숫자가 들어올 때 줄이 흔들리지 않게 하고, 받지 못하면 `–` 를 둔다. skeleton 이 영영 남지 않는다.
 * -----------------------------------------------------------------------------------------------*/
export default function StatCount({ value, label, className }: StatCountProps) {
  if (value === undefined) {
    return (
      <span
        data-slot="stat-count"
        role="status"
        aria-label={`${label} 불러오는 중`}
        className={cn('skeleton inline-block h-[1em] w-6 align-middle', className)}
      />
    );
  }

  if (value === null) {
    return (
      <p
        data-slot="stat-count"
        aria-label={`${label}를 불러오지 못했습니다`}
        className={cn('layout-text', className)}
      >
        –
      </p>
    );
  }

  return (
    <p
      data-slot="stat-count"
      aria-label={`${label} ${value}`}
      className={cn('layout-text', className)}
    >
      {value}
    </p>
  );
}
