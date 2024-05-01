import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';
import { IFireStore } from '$shared/types/global';

interface Props extends IFireStore {
  src: string;
}

/**
 * @summary firebase에 image를 업로드하는 함수
 * @param props
 * @returns
 */
export default async function uploadImage(props: Props): Promise<string> {
  const { src, collection, category, title } = props;
  if (!src) {
    const WrongSrcError = new Error('이미지 주소가 올바르지 않습니다.');
    Logger.error(WrongSrcError);
    throw WrongSrcError;
  }

  const isSrc = src.replace(/#x26;/g, '&');

  const response = await fetch(isSrc);
  const data = await response.arrayBuffer();

  // 확장자
  const ext = isSrc.includes('unsplash')
    ? String(isSrc.split('fm=').pop()).split('&').shift()
    : String(isSrc.split('.').pop()).split('?').shift();

  // 파일 이름
  const filename = decodeURIComponent(
    String(String(isSrc.split('/').pop()).split('?').shift())
      .split('.')
      .shift()!,
  );

  // 메타데이터
  const metadata = {
    cacheControl: 'public, max-age=31556952, s-maxage=31556952, immutable',
    contentType: `image/${ext}`,
  };

  // 유닉스 타임
  const hashTime = new Date().getTime();

  const collectionRef = ref(
    storage,
    `${collection}/${category}/${title}/${filename}-${hashTime}.${ext}`,
  );

  // firebase에 올린 파일 주소 얻기
  const imgFirebaseUrl = await uploadBytes(collectionRef, data, metadata).then(async () => {
    Logger.update(`${filename}-${hashTime}.${ext}`);
    const url = await getDownloadURL(collectionRef);
    return url;
  });

  // GCP 주소로 변환
  const imgPath = imgFirebaseUrl.split('jaehan-flow.appspot.com/o/')[1].split('?')[0];
  const imgGcpUrl = `https://storage.googleapis.com/jaehan-flow.appspot.com/${imgPath}`;

  return imgGcpUrl;
}
