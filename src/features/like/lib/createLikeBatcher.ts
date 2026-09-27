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
  /**
   * 실패를 다시 보낼지. false 면 그 수를 버리고 전송기를 멈춘다.
   * 404 처럼 다시 보내도 같은 결과인 실패를 거르는 데 쓴다. 기본값은 모두 다시 보낸다
   */
  shouldRetry?: (error: unknown) => boolean;
  /** 실패가 이어질 때 늘어나는 간격의 상한(ms) */
  maxInterval?: number;
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
 * 실패해도 줄지 않는다. 실패가 이어지면 간격을 두 배씩 늘리고(`maxInterval` 까지), 성공하면 되돌린다.
 *
 * `shouldRetry` 가 false 를 돌려주는 실패(없는 콘텐츠의 404 등)는 다시 보내도 같다. 그 수를 버리고 전송기를
 * 멈춰, 그 뒤로 누른 것도 보내지 않는다. 멈추지 않으면 페이지를 떠날 때까지 1초마다 같은 실패를 되풀이한다.
 * @param options 보내는 함수와 결과를 받을 콜백
 * @returns 클릭을 받는 묶음 전송기
 * @example
 * const batcher = createLikeBatcher({ send: (n, k) => postLike(kind, key, n, k), onSent, onChange });
 * button.onclick = () => batcher.add();
 */
export default function createLikeBatcher(options: LikeBatcherOptions): LikeBatcher {
  const {
    send,
    onSent,
    onChange,
    interval = 1000,
    max = 100,
    shouldRetry = () => true,
    maxInterval = 30_000,
  } = options;
  let pending = 0;
  let inFlight = 0;
  /** 이어진 실패 수. 다음 간격을 interval × 2^failures 로 늘린다 */
  let failures = 0;
  let stopped = false;
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
        failures = 0;
        onSent(likes);
      })
      .catch((error: unknown) => {
        inFlight -= count;
        if (shouldRetry(error)) {
          pending += count;
          failures += 1;
          return;
        }
        stopped = true;
        pending = 0;
        stopTimer();
      })
      .finally(() => {
        notify();
        if (pending > 0) schedule();
      });
  };

  const stopTimer = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };

  const schedule = () => {
    if (stopped || timer !== undefined) return;
    const delay = Math.min(interval * 2 ** failures, maxInterval);
    timer = setTimeout(() => {
      timer = undefined;
      // 한 번에 하나만 보낸다. 보내는 중이면 끝난 뒤(finally)에 다시 잡는다
      if (inFlight === 0) dispatch(false);
    }, delay);
  };

  return {
    add: () => {
      if (stopped) return;
      pending += 1;
      notify();
      schedule();
    },
    flushNow: (keepalive) => {
      stopTimer();
      // 떠나는 중에는 보내는 중인 요청을 기다릴 수 없어 남은 것을 따로 보낸다
      while (pending > 0) dispatch(keepalive);
    },
    unsent: () => pending + inFlight,
    dispose: stopTimer,
  };
}
