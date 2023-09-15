import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '@utils/firebase.server';

export default async function saveImageIntoFirebase(res: any, category: string, title: string) {
  const imgSrcRegex = /<img[^>]*src="([^"]*)"/g;
  const imgSrcArray: string[] = [];
  let match = imgSrcRegex.exec(res);

  // notion url에서 img src 추출
  while (match !== null) {
    if (!match[1].includes('firebasestorage')) {
      imgSrcArray.push(match[1]);
    }
    match = imgSrcRegex.exec(res);
  }

  const uploadImages = async (srcUrl: string) => {
    const response = await fetch(srcUrl);
    const data = await response.arrayBuffer();

    const ext = String(srcUrl.split('.').pop()).split('?').shift();
    const filename = String(String(srcUrl.split('/').pop()).split('?').shift())
      .split('.')
      .shift();
    const metadata = { contentType: `image/${ext}` };

    const postRef = ref(storage, `post/${category}/${title}/${filename}.${ext}`);
    const ImgUrl = await uploadBytes(postRef, data, metadata).then(async () => {
      console.log(`------- [update ${filename}.${ext}] -------`);
      const url = await getDownloadURL(postRef);
      return url;
    });

    return ImgUrl;
  };

  try {
    if (imgSrcArray.length === 0) {
      return res;
    }

    const convertImgSrcArray = await Promise.all(
      imgSrcArray.map(async (img) => {
        const ImgUrl = await uploadImages(img.replace(/#x26;/g, '&'));
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
