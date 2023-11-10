/* eslint-disable array-callback-return */
import { deleteObject, ref, listAll } from 'firebase/storage';

import { storage } from '@utils/firebase.server';

export default async function deleteStore(category: string, title: string) {
  const listRef = ref(storage, `post/${category}/${title}`);

  const res = await listAll(listRef);

  res.items.map((item) => {
    const itemRef = ref(storage, `post/${category}/${title}/${item.name}`);

    deleteObject(itemRef)
      .then(() => {
        console.log(`----- [delete ${item.name}] -----`);
      })
      .catch((error) => {
        console.log(error);
        throw new Error(`${item.name} 삭제에 실패하였습니다`);
      });
  });
}
