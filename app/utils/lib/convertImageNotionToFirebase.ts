import uploadImageToFirebase from './uploadImageToFirebase';
import searchNotFirebaseUrl from './searchNotFirebaseUrl';

export default async function convertImageNotionToFirebase(
  res: any,
  category: string,
  title: string,
) {
  const imgSrcArray = searchNotFirebaseUrl(res);

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

    const modifiedRes = await imgSrcArray.reduce((acc, imgSrc, index) => {
      return acc.replace(imgSrc, convertImgSrcArray[index]);
    }, res);

    return modifiedRes;
  } catch (err) {
    console.log(err);
  }

  return res;
}
