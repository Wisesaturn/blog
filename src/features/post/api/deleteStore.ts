/* eslint-disable array-callback-return */
import { deleteObject, ref, listAll } from 'firebase/storage';

import { storage } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

export default async function deleteStore(category: string, title: string) {
  const listRef = ref(storage, `post/${category}/${title}`);

  const res = await listAll(listRef);

  // delete target storage
  await Promise.all(
    res.items.map(async (item) => {
      const itemRef = ref(storage, `post/${category}/${title}/${item.name}`);

      try {
        await deleteObject(itemRef);
        Logger.delete(`${category}/${title}/${item.name}`);
      } catch (error) {
        if (error instanceof Error) {
          Logger.error(new Error(`${item.name}을 삭제할 수 없습니다.`));
          Logger.error(error);
        }
        throw error;
      }
    }),
  );

  if (res.items.length === 0) {
    Logger.warn(`${category}/${title}에 저장된 파일이 없습니다.`);
  } else {
    Logger.success(`${category}/${title}의 모든 파일 삭제가 완료되었습니다.`);
  }
}
