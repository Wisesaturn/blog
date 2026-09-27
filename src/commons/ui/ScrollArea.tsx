import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type Ref,
} from 'react';

import { cn } from '@/commons/lib';

type FadeEdge = 'top' | 'bottom' | 'both';

interface ScrollAreaProps extends ComponentPropsWithoutRef<typeof RadixScrollArea.Root> {
  /** 스크롤하는 영역(Viewport)의 클래스. 높이(`max-h-*`)와 `scroll-padding` 을 여기에 준다 */
  viewportClassName?: string;
  /** 스크롤하는 영역. 코드로 스크롤 위치를 옮길 때 쓴다 */
  viewportRef?: Ref<HTMLDivElement>;
  /** 더 스크롤할 내용이 있는 쪽 가장자리를 흐리게 한다 */
  fade?: boolean;
}

/** 스크롤 위치로 흐리게 할 가장자리를 정한다. 1px 은 소수점 스크롤 오차다 */
function getFadeEdge(viewport: HTMLElement): FadeEdge | undefined {
  const { scrollTop, scrollHeight, clientHeight } = viewport;
  const top = scrollTop > 1;
  const bottom = scrollTop + clientHeight < scrollHeight - 1;
  if (top && bottom) return 'both';
  if (top) return 'top';
  if (bottom) return 'bottom';
  return undefined;
}

/* -------------------------------------------------------------------------------------------------
 * ScrollArea
 * 높이를 정한 상자 안에서 따로 스크롤하는 영역. Radix ScrollArea 를 감쌌다. 스크롤과 키보드 조작은 브라우저
 * 기본 동작 그대로이고, 스크롤바 모양만 바꾼다.
 *
 * 스크롤바는 내용이 넘칠 때만 보이고(`type="auto"`), 마우스를 올렸을 때만 나타나게 하지 않는다. 숨겨 두면
 * 스크롤할 수 있다는 것을 모른다. `fade` 를 주면 더 내려갈 내용이 있는 쪽 가장자리를 흐리게 해 한 번 더 알린다.
 *
 * Radix Viewport 는 안쪽을 `display: table` 로 감싸 긴 줄이 줄바꿈되지 않는다. 세로 스크롤만 쓰므로 block 으로 둔다.
 * -----------------------------------------------------------------------------------------------*/
export default function ScrollArea({
  children,
  className,
  viewportClassName,
  viewportRef,
  fade = false,
  ...props
}: ScrollAreaProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [edge, setEdge] = useState<FadeEdge>();

  const setViewport = useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof viewportRef === 'function') viewportRef(node);
      else if (viewportRef) viewportRef.current = node;
    },
    [viewportRef],
  );

  useEffect(() => {
    const viewport = innerRef.current;
    if (!fade || !viewport) return undefined;

    const update = () => setEdge(getFadeEdge(viewport));
    update();
    viewport.addEventListener('scroll', update, { passive: true });
    // 목록 길이나 창 높이가 바뀌면 넘치는지도 바뀐다
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild);

    return () => {
      viewport.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [fade]);

  return (
    <RadixScrollArea.Root
      data-slot="scroll-area"
      type="auto"
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <RadixScrollArea.Viewport
        ref={setViewport}
        data-slot="scroll-area-viewport"
        data-fade={fade ? edge : undefined}
        className={cn(
          'size-full [&>div]:!block',
          'data-[fade=top]:[mask-image:linear-gradient(to_bottom,transparent,black_1.5rem)]',
          'data-[fade=bottom]:[mask-image:linear-gradient(to_top,transparent,black_1.5rem)]',
          'data-[fade=both]:[mask-image:linear-gradient(to_bottom,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)]',
          viewportClassName,
        )}
      >
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        data-slot="scroll-area-scrollbar"
        orientation="vertical"
        className="flex w-1.5 touch-none select-none p-px transition-[width] duration-150 hover:w-2"
      >
        <RadixScrollArea.Thumb className="relative flex-1 rounded-full bg-(--scrollbar-thumb) transition-colors hover:bg-(--scrollbar-thumb-hover)" />
      </RadixScrollArea.Scrollbar>
    </RadixScrollArea.Root>
  );
}
