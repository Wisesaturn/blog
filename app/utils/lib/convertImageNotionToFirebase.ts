import uploadImageToFirebase from './uploadImageToFirebase';

export default async function convertImageNotionToFirebase(
  res: any,
  category: string,
  title: string,
) {
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

  try {
    if (imgSrcArray.length === 0) {
      return res;
    }

    const convertImgSrcArray = await Promise.all(
      imgSrcArray.map(async (img) => {
        const ImgUrl = await uploadImageToFirebase(img, category, title);
        return ImgUrl;
      }),
    );

    const modifiedRes = imgSrcArray.reduce((acc, imgSrc, index) => {
      return acc.replace(imgSrc, convertImgSrcArray[index]);
    }, res);

    return modifiedRes;
  } catch (err) {
    console.log(err);
  }

  return res;
}
