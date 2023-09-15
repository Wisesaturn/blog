import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { storage } from '@utils/firebase.server';

const uploadImageToFirebase = async (srcUrl: string, category: string, title: string) => {
  const isSrcUrl = srcUrl.replace(/#x26;/g, '&');

  const response = await fetch(isSrcUrl);
  const data = await response.arrayBuffer();

  const ext = String(isSrcUrl.split('.').pop()).split('?').shift();
  const filename = String(String(isSrcUrl.split('/').pop()).split('?').shift())
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

export default uploadImageToFirebase;
