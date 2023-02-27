import { db } from '@utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { postingTypes } from '@Types/post';

export default async function getPost(document: string, id: string) {
  try {
    const docRef = doc(db, document, id.replace(/-/g, ' '));
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data() as postingTypes;

    const parsingDate = docSnap.data()!.createdAt.toDate().toLocaleString('ko-KR');

    return { ...docData, createdAt: parsingDate };
  } catch (err) {
    throw new Error('게시물을 찾을 수 없습니다.');
  }
}

// github API converts markdown
// const githubMdfunction = async (text: string) => {
//   return new Promise((resolve) => {
//     axios
//       .post(
//         'https://api.github.com/markdown',
//         {
//           text: `## 랄라라
//           Hello **world**`,
//           mode: 'gfm',
//         },
//         {
//           headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
//         },
//       )
//       .then((res) => {
//         resolve({
//           body: res.data,
//         });
//       })
//       .catch((err) => resolve(err));
//   });
// };
