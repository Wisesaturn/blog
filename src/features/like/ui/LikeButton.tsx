import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

import { cn, cva } from '@/commons/lib';

interface LikeButtonProps {
  /** 보여 줄 좋아요 수. 받는 중이면 `undefined`, 받지 못하면 `null` */
  likes: number | null | undefined;
  /** 한 번 눌렀다 */
  onLike: () => void;
  /** `sm`: 제목 옆 정보 줄, `lg`: 본문 아래 가운데 */
  size?: 'sm' | 'lg';
  className?: string;
}

/** 이 시간 안에 다시 누르면 새 말풍선을 띄우지 않고 떠 있는 말풍선의 수를 키운다 */
const COMBO_MS = 700;

/** 누를 때 하트에서 퍼지는 점. 각도(도). 작은 버튼만 쓴다 */
const SPARK_ANGLES = [-90, -30, 30, 90, 150, 210];

/** 흐르는 하트가 지나갈 수 있는 세로 열 수. 열을 정해 두어야 매트릭스처럼 줄지어 흐른다 */
const RAIN_COLUMNS = 9;
/** 한 번 누를 때 흘려보내는 줄 수 */
const RAIN_PER_TAP = 3;
/** 동시에 떠 있을 수 있는 줄 수. 연타해도 이 이상 늘지 않는다 */
const RAIN_MAX = 36;

const buttonVariants = cva(
  [
    'group relative inline-flex select-none items-center justify-center',
    'text-gray-600 dark:text-gray-300 transition-colors',
    'hover:text-(--green-main) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--green-main)',
  ],
  {
    variants: {
      size: {
        sm: 'gap-1 rounded-full px-2 py-0.5 -mx-2 hover:bg-(--green-main)/10',
        lg: [
          'size-16 rounded-full border layout-border layout-bg',
          'hover:border-(--green-main) hover:bg-(--green-main)/8 active:scale-95',
        ],
      },
    },
    defaultVariants: { size: 'sm' },
  },
);

function HeartIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} style={style} fill="currentColor">
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.9 4.5 6.7 4.5c2.1 0 3.6 1.1 4.4 2.5.2.3.6.3.8 0 .8-1.4 2.3-2.5 4.4-2.5 3.8 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

interface Burst {
  id: number;
  count: number;
}

interface Drop {
  id: number;
  /** 몇 번째 열인지 (0 ~ RAIN_COLUMNS-1) */
  column: number;
  /** 줄 하나에 이어 붙는 하트 수. 많을수록 꼬리가 길다 */
  length: number;
  /** 하트 크기(px) */
  size: number;
  /** 아래에서 위까지 가는 시간(s) */
  duration: number;
  delay: number;
}

let dropSeq = 0;

function createDrops(): Drop[] {
  return Array.from({ length: RAIN_PER_TAP }, (_, i) => ({
    id: (dropSeq += 1),
    column: Math.floor(Math.random() * RAIN_COLUMNS),
    length: 2 + Math.floor(Math.random() * 3),
    size: 8 + Math.floor(Math.random() * 5),
    duration: 1.1 + Math.random() * 0.7,
    delay: i * 0.06 + Math.random() * 0.08,
  }));
}

/* -------------------------------------------------------------------------------------------------
 * HeartRain
 * 큰 버튼 뒤로 하트 줄이 아래에서 위로 흘러 지나간다. 매트릭스의 글자비처럼 정해진 열을 따라 흐르고,
 * 앞머리 하트가 가장 진하고 꼬리로 갈수록 옅다. 위아래 끝은 mask 로 흐려 경계에서 잘리지 않게 한다.
 * -----------------------------------------------------------------------------------------------*/
function HeartRain({ drops, onDone }: { drops: Drop[]; onDone: (id: number) => void }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-y-0 left-1/2 w-60 -translate-x-1/2 overflow-hidden',
        '[mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]',
      )}
    >
      {drops.map((drop) => (
        <motion.span
          key={drop.id}
          className="absolute flex flex-col items-center text-(--green-main)"
          style={{
            left: `${((drop.column + 0.5) / RAIN_COLUMNS) * 100}%`,
            x: '-50%',
            gap: drop.size / 3,
          }}
          initial={{ top: '100%' }}
          animate={{ top: '-45%' }}
          transition={{ duration: drop.duration, delay: drop.delay, ease: [0.4, 0, 0.6, 1] }}
          onAnimationComplete={() => onDone(drop.id)}
        >
          {Array.from({ length: drop.length }, (_, i) => (
            <HeartIcon
              key={i}
              className="shrink-0"
              style={{ width: drop.size, height: drop.size, opacity: 0.55 * (1 - i / drop.length) }}
            />
          ))}
        </motion.span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * LikeButton
 * 누를 때마다 1씩 오르는 좋아요 버튼 (#120). 켜고 끄는 스위치가 아니다.
 *
 * 빠르게 연타하면 새 말풍선을 계속 띄우지 않고 떠 있는 말풍선이 +2, +3 … 으로 커진다. 요청을 1초마다 모아서
 * 보내는 동작(`createLikeBatcher`)과 모양을 맞췄다. 동작 줄이기 설정이면 움직이지 않고 숫자만 바뀐다.
 *
 * 작은 버튼은 하트 주변으로 점이 퍼지고, 큰 버튼은 점 대신 뒤로 하트 줄이 흐른다(`HeartRain`).
 * 둘 다 "주변으로 흩어지는" 효과라 한 버튼에 같이 두지 않는다.
 * -----------------------------------------------------------------------------------------------*/
export default function LikeButton({ likes, onLike, size = 'sm', className }: LikeButtonProps) {
  const reduceMotion = useReducedMotion();
  const heart = useAnimationControls();
  const [burst, setBurst] = useState<Burst | null>(null);
  const [sparkKey, setSparkKey] = useState(0);
  const [drops, setDrops] = useState<Drop[]>([]);
  const lastTapRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(hideTimerRef.current), []);

  const handleClick = useCallback(() => {
    onLike();
    if (reduceMotion) return;

    const now = Date.now();
    const combo = now - lastTapRef.current < COMBO_MS;
    lastTapRef.current = now;

    setBurst((prev) =>
      combo && prev ? { ...prev, count: prev.count + 1 } : { id: now, count: 1 },
    );
    if (size === 'lg') setDrops((prev) => [...prev, ...createDrops()].slice(-RAIN_MAX));
    else setSparkKey((k) => k + 1);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setBurst(null), COMBO_MS);

    heart.start({
      scale: [1, 0.78, 1.22, 1],
      rotate: [0, -8, 6, 0],
      transition: { duration: 0.42, ease: [0.34, 1.56, 0.64, 1] },
    });
  }, [heart, onLike, reduceMotion, size]);

  const removeDrop = useCallback((id: number) => {
    setDrops((prev) => prev.filter((drop) => drop.id !== id));
  }, []);

  const isLarge = size === 'lg';
  const iconClass = isLarge ? 'size-7' : 'size-4';
  const label = typeof likes === 'number' ? `좋아요 누르기, 지금 ${likes}개` : '좋아요 누르기';

  const count =
    likes === undefined ? (
      <span
        role="status"
        aria-label="좋아요 수 불러오는 중"
        className="skeleton inline-block h-[1em] w-6 align-middle"
      />
    ) : (
      <span className="layout-text tabular-nums" aria-hidden>
        {likes === null ? '–' : likes.toLocaleString('ko-KR')}
      </span>
    );

  const button = (
    <button
      type="button"
      data-slot="like-button"
      aria-label={label}
      onClick={handleClick}
      className={cn(buttonVariants({ size }), !isLarge && className)}
    >
      <span className="relative inline-flex">
        <motion.span
          animate={heart}
          className="inline-flex text-(--green-main) group-hover:drop-shadow-[0_0_6px_var(--green-main)]"
        >
          <HeartIcon className={iconClass} />
        </motion.span>

        {!reduceMotion && !isLarge && sparkKey > 0 && (
          <span key={sparkKey} aria-hidden className="pointer-events-none absolute inset-0">
            {SPARK_ANGLES.map((deg) => (
              <motion.span
                key={deg}
                className="absolute left-1/2 top-1/2 size-1 rounded-full bg-(--green-main)"
                initial={{ x: '-50%', y: '-50%', opacity: 1, scale: 1 }}
                animate={{
                  x: `calc(-50% + ${Math.cos((deg * Math.PI) / 180) * (isLarge ? 26 : 14)}px)`,
                  y: `calc(-50% + ${Math.sin((deg * Math.PI) / 180) * (isLarge ? 26 : 14)}px)`,
                  opacity: 0,
                  scale: 0.4,
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            ))}
          </span>
        )}

        <AnimatePresence>
          {burst && (
            <motion.span
              key={burst.id}
              aria-hidden
              className={cn(
                'pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full',
                'bg-(--green-main) px-1.5 font-bold text-white tabular-nums shadow-sm',
                isLarge ? '-top-9 text-sm' : '-top-6 text-[10px] leading-4',
              )}
              initial={{ opacity: 0, y: 6, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 + Math.min(burst.count, 20) * 0.02 }}
              exit={{ opacity: 0, y: -14, transition: { duration: 0.35 } }}
              transition={{ type: 'spring', stiffness: 520, damping: 22 }}
            >
              +{burst.count}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {!isLarge && count}
    </button>
  );

  if (!isLarge) return button;

  return (
    <div
      data-slot="like-panel"
      className={cn('relative flex flex-col items-center gap-3 py-10', className)}
    >
      {!reduceMotion && <HeartRain drops={drops} onDone={removeDrop} />}
      {/* hover 배경이 반투명이라, 불투명한 바탕을 깔아 흐르는 하트가 버튼 안으로 비치지 않게 한다 */}
      <div className="layout-bg relative rounded-full">{button}</div>
      <p className="relative flex items-baseline gap-1 text-sm text-gray-600 dark:text-gray-300">
        <span className="text-base font-semibold text-(--green-main)">{count}</span>번 눌렸어요
      </p>
    </div>
  );
}
