/**
 * @summary body에서 업로드할 이미지 URL를 추출하는 함수
 * @param body
 * @returns
 */
export default function filterNotionUrl(body: string): string[] {
  const imgSrcRegex = /<img[^>]*src="([^"]*)"/g;
  const imgSrcArray: string[] = [];
  let match = imgSrcRegex.exec(body);

  // notion url에서 img src 추출
  while (match !== null) {
    if (
      !match[1].includes('firebasestorage') &&
      !match[1].includes('storage.googleapis.com/jaehan-flow.appspot.com') &&
      !match[1].includes('giphy.com')
    ) {
      imgSrcArray.push(match[1]);
    }
    match = imgSrcRegex.exec(body);
  }

  if (imgSrcArray.length === 0) {
    return [];
  }

  return imgSrcArray;
}
