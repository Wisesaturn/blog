import { ref, uploadBytes } from 'firebase/storage';

import { storage } from '@utils/firebase.server';

export default function saveImageIntoFirebase(res: any) {
  const test = `https://s3.us-west-2.amazonaws.com/secure.notion-static.com/482c3cd6-929d-438e-9a70-0cdf7a85821b/thumbnail.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230914%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230914T164034Z&X-Amz-Expires=3600&X-Amz-Signature=e188bc2e7c9d3c49a40608573f5d81c5aabbf1c4ec7c93612b5b6b7197dcab8f&X-Amz-SignedHeaders=host&x-id=GetObject`;
  const imgSrcRegex = /<img[^>]*src="([^"]*)"/g;
  const imgSrcArray = [];
  let match = imgSrcRegex.exec(res);

  // notion url에서 img src 추출
  while (match !== null) {
    imgSrcArray.push(match[1]);
    match = imgSrcRegex.exec(res);
  }

  const uploadImages = async () => {
    const response = await fetch(test);
    const data = await response.blob();
    const ext = String(test.split('.').pop()).split('?').shift();
    const filename = test.split('/').pop();
    const metadata = { type: `image/${ext}` };
    const file = new File([data], filename!, metadata);

    const mountainsRef = ref(storage, `images/${filename}.${ext}`);
    uploadBytes(mountainsRef, file).then((snapshot) => {
      console.log('update!');
    });
  };

  // TODO : 파일 추출해서 업로드 후 다시 load해서 file 주소를 바꿔놓아야 함
  try {
    uploadImages();
  } catch (err) {
    console.log(err);
  }
}
