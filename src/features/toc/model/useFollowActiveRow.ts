import { useReducedMotion } from 'motion/react';
import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type PointerEvent,
  type RefObject,
} from 'react';

/**
 * `container` 는 CSSOM View 에 새로 들어온 옵션이라 TypeScript DOM 타입에 아직 없다.
 * `nearest` 면 가장 가까운 스크롤 상자(목차)만 스크롤하고 페이지로 번지지 않는다.
 */
interface ScrollIntoViewContainerOptions extends ScrollIntoViewOptions {
  container?: 'all' | 'nearest';
}

interface FollowHandlers {
  onPointerEnter: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave: (event: PointerEvent<HTMLElement>) => void;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: (event: FocusEvent<HTMLElement>) => void;
}

/**
 * @description 목차 상자 안에서 현재 제목의 행이 늘 보이게 목차를 따라 스크롤한다 (#125)
 *
 * `scrollIntoView({ block: 'nearest', container: 'nearest' })` 로 옮긴다.
 * - `block: 'nearest'`: 행이 보이는 동안은 움직이지 않고, 벗어날 때만 가까운 쪽 끝에 맞춘다. 목차 뷰포트의
 *   `scroll-padding-block` 만큼 여유를 남겨 가장자리에 붙지 않는다
 * - `container: 'nearest'`: 목차만 스크롤하고 페이지는 건드리지 않는다. 이 옵션을 모르는 브라우저는 무시하고
 *   조상까지 스크롤하지만, 목차는 화면 안에 sticky 로 붙어 있고 화면보다 낮아서 행이 이미 화면 안에 있다.
 *   그래서 페이지까지 움직일 일은 없다
 *
 * 사람이 목차를 보고 있을 때는 움직이지 않는다. 목차 위에 마우스가 있거나 키보드 포커스가 목차 안에 있으면
 * 멈추고, 벗어나면 그때의 현재 행으로 따라간다. 목차 항목을 눌러 페이지가 부드럽게 스크롤되는 동안 현재 제목이
 * 여러 번 바뀌어도 목차가 흔들리지 않게 하려는 것이다.
 *
 * 포커스는 키보드 포커스(`:focus-visible`)만 센다. 마우스로 누른 링크에도 포커스가 남아서, 모든 포커스를 세면
 * 마우스를 치운 뒤에도 계속 멈춰 있다.
 *
 * 동작 줄이기 설정이면 부드러운 스크롤 없이 바로 옮긴다.
 * @param params.viewportRef 목차의 스크롤 영역
 * @param params.activeId 지금 제목의 id. 바뀔 때마다 따라간다
 * @returns 목차 영역에 붙일 포인터·포커스 핸들러
 * @example
 * const follow = useFollowActiveRow({ viewportRef, activeId: selectId });
 * <div {...follow}><ScrollArea viewportRef={viewportRef}>…</ScrollArea></div>
 */
export default function useFollowActiveRow({
  viewportRef,
  activeId,
}: {
  viewportRef: RefObject<HTMLElement | null>;
  activeId: string;
}): FollowHandlers {
  const reduceMotion = useReducedMotion();
  const pointerInside = useRef(false);
  const focusInside = useRef(false);

  const follow = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || pointerInside.current || focusInside.current) return;

    const row = viewport.querySelector<HTMLElement>('[aria-current="location"]');
    const options: ScrollIntoViewContainerOptions = {
      block: 'nearest',
      container: 'nearest',
      behavior: reduceMotion ? 'instant' : 'smooth',
    };
    row?.scrollIntoView(options);
  }, [viewportRef, reduceMotion]);

  // 행의 aria-current 는 렌더에서 바뀌므로, 커밋된 뒤(effect)에 찾는다
  useEffect(follow, [activeId, follow]);

  return {
    onPointerEnter: () => {
      pointerInside.current = true;
    },
    onPointerLeave: () => {
      pointerInside.current = false;
      follow();
    },
    onFocus: (event) => {
      if (event.target.matches(':focus-visible')) focusInside.current = true;
    },
    onBlur: (event) => {
      // 목차 안의 다른 항목으로 옮기는 중이면 아직 안에 있다
      if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
      focusInside.current = false;
      follow();
    },
  };
}
