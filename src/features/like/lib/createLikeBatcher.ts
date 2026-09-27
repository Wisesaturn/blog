interface LikeBatcherOptions {
  /** 모은 수를 보내고 올린 뒤의 좋아요 수를 받는다. `keepalive` 는 페이지를 떠나는 중일 때 true */
  send: (count: number, keepalive: boolean) => Promise<number>;
  /** 서버가 돌려준 좋아요 수. 화면의 기준값을 이 값으로 맞춘다 */
  onSent: (likes: number) => void;
  /** 아직 서버 합계에 들어가지 않은 클릭 수가 바뀔 때마다 부른다 */
  onChange: (unsent: number) => void;
  /** 보내는 간격(ms). 누르는 동안 이 간격마다 모인 수를 보낸다 */
  interval?: number;
  /** 한 번에 보낼 수 있는 최대 수. 넘는 만큼은 다음 묶음으로 넘긴다 */
  max?: number;
}

export interface LikeBatcher {
  /** 한 번 눌렀다 */
  add: () => void;
  /** 기다리지 않고 지금 모인 것을 보낸다. 페이지를 떠날 때 `keepalive` 로 부른다 */
  flushNow: (keepalive: boolean) => void;
  /** 아직 서버 합계에 들어가지 않은 수 (모으는 중 + 보내는 중) */
  unsent: () => number;
  /** 타이머를 멈춘다. 화면을 떠날 때 부른다 */
  dispose: () => void;
}

/**
 * @description 좋아요 클릭을 모아 일정 간격으로 보내는 묶음 전송기를 만든다 (#120)
 *
 * 누를 때마다 요청하면 연타 10번에 Firestore 쓰기 10번이다. 첫 클릭부터 `interval` 뒤에 그동안 모인 수를
 * 한 번에 보내고, 계속 누르면 다음 간격에 또 보낸다(쓰로틀, 마지막 묶음 포함). 한 번에 하나만 보내고,
 * 보내는 동안 눌린 수는 다음 묶음으로 넘긴다.
 *
 * 실패하면 되돌리지 않고 그 수를 다음 묶음에 합쳐 다시 보낸다. 화면 숫자는 기준값 + `unsent()` 라
 * 실패해도 줄지 않는다.
 * @param options 보내는 함수와 결과를 받을 콜백
 * @returns 클릭을 받는 묶음 전송기
 * @example
 * const batcher = createLikeBatcher({ send: (n, k) => postLike(kind, key, n, k), onSent, onChange });
 * button.onclick = () => batcher.add();
 */
export default function createLikeBatcher(options: LikeBatcherOptions): LikeBatcher {
  const { send, onSent, onChange, interval = 1000, max = 100 } = options;
  let pending = 0;
  let inFlight = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const notify = () => onChange(pending + inFlight);

  const dispatch = (keepalive: boolean) => {
    const count = Math.min(pending, max);
    if (count === 0) return;
    pending -= count;
    inFlight += count;

    send(count, keepalive)
      .then((likes) => {
        inFlight -= count;
        onSent(likes);
      })
      .catch(() => {
        inFlight -= count;
        pending += count;
      })
      .finally(() => {
        notify();
        if (pending > 0) schedule();
      });
  };

  const schedule = () => {
    if (timer !== undefined) return;
    timer = setTimeout(() => {
      timer = undefined;
      // 한 번에 하나만 보낸다. 보내는 중이면 끝난 뒤(finally)에 다시 잡는다
      if (inFlight === 0) dispatch(false);
    }, interval);
  };

  return {
    add: () => {
      pending += 1;
      notify();
      schedule();
    },
    flushNow: (keepalive) => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      // 떠나는 중에는 보내는 중인 요청을 기다릴 수 없어 남은 것을 따로 보낸다
      while (pending > 0) dispatch(keepalive);
    },
    unsent: () => pending + inFlight,
    dispose: () => {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
    },
  };
}
