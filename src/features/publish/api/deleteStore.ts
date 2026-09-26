import { deleteObject, listAll, ref } from 'firebase/storage';

import Logger from '@/commons/lib/logger';
import { storage } from '@/commons/api/firebase.server';
import { IFireStore } from '@/commons/types/global';

interface Props extends IFireStore {
  /** 지우지 않을 파일의 Storage 경로. 방금 저장한 문서가 가리키는 파일이다 (`getStoragePaths`) */
  keep: Set<string>;
}

/**
 * @description 문서 폴더에서 `keep` 에 없는 옛 파일을 지운다.
 * Firestore 저장이 성공한 뒤에 부른다. 먼저 지우면 발행이 실패했을 때 운영 문서가 지워진 파일을 가리킨다 (#104).
 * 저장은 이미 끝났으므로 지우지 못한 파일이 있어도 에러를 던지지 않고 경고만 남긴다. 남은 파일은 다음 발행 때 지운다
 * @param props 문서 폴더(collection/category/title)와 남길 경로
 */
export default async function deleteStore(props: Props): Promise<void> {
  const { category, title, collection, keep } = props;
  const folder = `${collection}/${category}/${title}`;

  try {
    const res = await listAll(ref(storage, folder));
    const staleItems = res.items.filter((item) => !keep.has(item.fullPath));

    if (staleItems.length === 0) {
      Logger.log(`${folder}에 지울 옛 파일이 없습니다.`);
      return;
    }

    const results = await Promise.allSettled(
      staleItems.map(async (item) => {
        await deleteObject(item);
        Logger.delete(item.fullPath);
      }),
    );

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    if (failedCount > 0) {
      Logger.warn(`${folder}의 옛 파일 ${failedCount}개를 지우지 못했습니다.`);
    } else {
      Logger.success(`${folder}의 옛 파일 ${staleItems.length}개를 지웠습니다.`);
    }
  } catch (err) {
    if (err instanceof Error) {
      Logger.warn(`${folder}의 옛 파일을 정리하지 못했습니다.`, err);
    }
  }
}
