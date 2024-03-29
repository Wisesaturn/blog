import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

interface Props {
  src: string;
  category: string;
  title: string;
}

/**
 * @summary firebase에 image를 업로드하는 함수
 * @param props
 * @returns
 */
export default async function uploadImage(props: Props): Promise<string> {
  const { src, category, title } = props;
  if (!src) {
    const WrongSrcError = new Error('이미지 주소가 올바르지 않습니다.');
    Logger.error(WrongSrcError);
    throw WrongSrcError;
  }

  const isSrc = src.replace(/#x26;/g, '&');

  const response = await fetch(isSrc);
  const data = await response.arrayBuffer();

  const ext = isSrc.includes('unsplash')
    ? String(isSrc.split('fm=').pop()).split('&').shift()
    : String(isSrc.split('.').pop()).split('?').shift();
  const filename = decodeURIComponent(
    String(String(isSrc.split('/').pop()).split('?').shift())
      .split('.')
      .shift()!,
  );
  const metadata = {
    cacheControl: 'public, max-age=31556952, s-maxage=31556952, immutable',
    contentType: `image/${ext}`,
  };
  const hashTime = new Date().getTime();

  const postRef = ref(storage, `post/${category}/${title}/${filename}-${hashTime}.${ext}`);
  const ImgUrl = await uploadBytes(postRef, data, metadata).then(async () => {
    Logger.update(`${filename}-${hashTime}.${ext}`);
    const url = await getDownloadURL(postRef);
    return url;
  });

  return ImgUrl;
}
