/** 커버 이미지가 없는 글과 프로젝트, 공유 미리보기에 쓰는 기본 썸네일 */
export const DEFAULT_THUMBNAIL =
  'https://user-images.githubusercontent.com/79848632/220535309-f7a02b94-5eab-46bf-867c-8c9c82475620.png';

/**
 * 배포된 블로그 버전. `package.json` 에서 읽으므로 버전을 올리는 커밋만으로 푸터 표기도 바뀐다.
 * Vite 는 JSON 의 이름 있는 import 를 tree shaking 해서 `version` 값만 번들에 넣는다.
 */
export { version as APP_VERSION } from '../../../package.json';

/** 푸터의 버전 표기가 가리키는 릴리즈 노트 */
export const RELEASE_URL = 'https://github.com/Wisesaturn/blog/releases';
