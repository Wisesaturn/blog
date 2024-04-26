/* eslint-disable array-callback-return */
import { deleteObject, ref, listAll } from 'firebase/storage';

import { storage } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';
import { IFireStore } from '$shared/types/global';

export default async function deleteStore(props: IFireStore) {
  const { category, title, collection } = props;
  try {
    Logger.log(`${collection}/${category}/${title} 기존 파일 삭제`);
    const listRef = ref(storage, `${collection}/${category}/${title}`);
    const res = await listAll(listRef);

    // delete target storage
    await Promise.all(
      res.items.map(async (item) => {
        const itemRef = ref(storage, `${collection}/${category}/${title}/${item.name}`);

        try {
          await deleteObject(itemRef);
          Logger.delete(`${collection}/${category}/${title}/${item.name}`);
        } catch (error) {
          if (error instanceof Error) {
            Logger.error(new Error(`${item.name}을 삭제할 수 없습니다.`, { cause: error }));
          }
          throw error;
        }
      }),
    );

    if (res.items.length === 0) {
      Logger.warn(`${collection}/${category}/${title}에 저장된 파일이 없습니다.`);
    } else {
      Logger.success(`${collection}/${category}/${title}의 모든 파일 삭제가 완료되었습니다.`);
    }
  } catch (err) {
    if (err instanceof Error) {
      const UnknownError = new Error('알 수 없는 이유로 파일 삭제에 실패했습니다', { cause: err });
      Logger.error(UnknownError);
      throw UnknownError;
    }
  }
}
