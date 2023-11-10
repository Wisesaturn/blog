export default function searchNotFirebaseUrl(res: string): string[] {
  const imgSrcRegex = /<img[^>]*src="([^"]*)"/g;
  const imgSrcArray: string[] = [];
  let match = imgSrcRegex.exec(res);

  // notion url에서 img src 추출
  while (match !== null) {
    if (!match[1].includes('firebasestorage') && !match[1].includes('giphy.com')) {
      imgSrcArray.push(match[1]);
    }
    match = imgSrcRegex.exec(res);
  }

  if (imgSrcArray.length === 0) {
    return [];
  }

  return imgSrcArray;
}
