import { type Darkmode } from '@/commons/types/layout';

/**
 * 테마는 사람마다 다르므로 브라우저에만 둔다. 서버 응답(HTML, `.data`)에는 싣지 않는다.
 *
 * 상세 페이지는 빌드 때 굽고 목록은 CDN 에 캐시되어, 서버가 넣은 테마는 지금 보는 사람의 것이 아닐 수 있다.
 * 예전에는 root loader 가 쿠키를 읽어 `<html color-theme>` 에 넣었는데, 구운 `.data` 의 `light` 나
 * 다른 사람 쿠키로 만든 캐시가 페이지를 이동할 때 테마를 덮어썼다 (#106).
 */
export const THEME_STORAGE_KEY = 'color-theme';

const THEME_ATTRIBUTE = 'color-theme';
export const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

/** `html` 배경색(`--white`)과 맞춘 브라우저 주소창 색 */
const THEME_COLOR: Record<Darkmode, string> = { light: '#fff', dark: '#222' };

function isDarkmode(value: unknown): value is Darkmode {
  return value === 'dark' || value === 'light';
}

/**
 * @description 사용자가 직접 고른 테마를 읽는다. 고른 적이 없거나 저장소를 쓸 수 없으면 `null`
 */
export function getStoredTheme(): Darkmode | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isDarkmode(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * @description 사용자가 고른 테마를 저장한다. 사생활 보호 모드처럼 저장할 수 없으면 조용히 넘어간다
 */
export function storeTheme(theme: Darkmode) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // 저장하지 못해도 지금 페이지의 테마는 바뀐다
  }
}

/**
 * @description 시스템 설정의 테마
 */
export function getSystemTheme(): Darkmode {
  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? 'dark' : 'light';
}

/**
 * @description 보여줄 테마를 정한다. 직접 고른 값이 시스템 설정보다 먼저다
 */
export function resolveTheme(): Darkmode {
  return getStoredTheme() ?? getSystemTheme();
}

/**
 * @description 지금 문서에 적용된 테마. 서버에서는 문서가 없으므로 `light`
 */
export function getDocumentTheme(): Darkmode {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute(THEME_ATTRIBUTE) === 'dark' ? 'dark' : 'light';
}

/**
 * @description `<html color-theme>` 와 `<meta name="theme-color">` 를 테마에 맞춘다.
 * meta 는 React 가 그리지 않는다. 그리면 `color-theme` 처럼 다시 렌더할 때 덮어쓸 수 있다.
 */
export function applyTheme(theme: Darkmode) {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = THEME_COLOR[theme];
}

/**
 * @description `<html color-theme>` 이 바뀔 때마다 알린다. `useSyncExternalStore` 의 subscribe 로 쓴다
 * @returns 구독 해제 함수
 */
export function subscribeDocumentTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [THEME_ATTRIBUTE],
  });
  return () => observer.disconnect();
}

/**
 * 페인트 전에 `<head>` 에서 동기로 실행해 테마를 정한다. 하이드레이션을 기다리면 다크 모드 사용자에게
 * 밝은 화면이 먼저 보인다. 위 함수들과 같은 규칙을 번들 없이 돌도록 문자열로 옮겼다.
 *
 * v2 는 방문할 때마다 `color-theme` 쿠키를 1년 만료로 자동으로 심었다. 사용자가 고른 값과 구분할 수 없어서
 * 값을 옮기지 않고 지운다. 옮기면 시스템을 다크로 바꾼 사람도 v2 가 심은 `light` 에 묶인다.
 */
export const THEME_SCRIPT = `(function(){var d=document,t;try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');t=s==='dark'||s==='light'?s:null;}catch(e){t=null;}if(!t){try{t=window.matchMedia('${SYSTEM_DARK_QUERY}').matches?'dark':'light';}catch(e){t='light';}}d.documentElement.setAttribute('${THEME_ATTRIBUTE}',t);try{var m=d.createElement('meta');m.name='theme-color';m.content=t==='dark'?'${THEME_COLOR.dark}':'${THEME_COLOR.light}';d.head.appendChild(m);}catch(e){}if(/(?:^|; )color-theme=/.test(d.cookie)){d.cookie='color-theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';}})();`;
