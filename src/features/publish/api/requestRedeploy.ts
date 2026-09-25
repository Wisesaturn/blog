/**
 * @description Vercel Deploy Hook 을 불러 프로덕션을 다시 빌드한다. 발행이 Firestore 에 저장된 뒤에만 부른다
 *
 * 상세 페이지는 빌드 때 HTML 로 굽기 때문에, 새로 발행하거나 고친 글은 다시 빌드해야 반영된다.
 * 빌드에 없는 새 글은 SSR 로도 열리지만, 이미 구운 글을 고친 내용은 재배포 전까지 예전 HTML 이 나간다.
 *
 * `VERCEL_DEPLOY_HOOK_URL` 이 없으면 경고만 남기고 건너뛴다. 로컬에서 발행을 시험할 때 매번
 * 프로덕션이 다시 빌드되지 않게 하려는 것이다.
 * @throws Deploy Hook 이 2xx 가 아닌 응답을 주면 에러가 발생한다
 */
export default async function requestRedeploy(): Promise<void> {
  const url = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!url) {
    console.warn('VERCEL_DEPLOY_HOOK_URL 이 없어 재배포를 건너뜁니다');
    return;
  }

  const res = await fetch(url, { method: 'POST' });
  if (!res.ok) {
    throw new Error(`발행은 저장됐지만 재배포 요청이 실패했습니다 (${res.status})`);
  }
}
