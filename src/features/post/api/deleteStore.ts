/* eslint-disable array-callback-return */
import { deleteObject, ref, listAll } from 'firebase/storage';
import chalk from 'chalk';

import { storage } from '$shared/middleware/firebase';

export default async function deleteStore(category: string, title: string) {
  const listRef = ref(storage, `post/${category}/${title}`);

  const res = await listAll(listRef);

  // delete target storage
  await Promise.all(
    res.items.map(async (item) => {
      const itemRef = ref(storage, `post/${category}/${title}/${item.name}`);

      try {
        await deleteObject(itemRef);
        console.log(chalk.gray(`[DELETE] ${category}/${title}/${item.name}`));
      } catch (error) {
        console.log(chalk.red(`[ERROR] ${item.name}을 삭제할 수 없습니다.`));
        throw error;
      }
    }),
  );

  if (res.items.length === 0) {
    console.log(chalk.yellow(`[WARN] ${category}/${title}에 저장된 파일이 없습니다.`));
  } else {
    console.log(chalk.green(`[SUCCESS] ${category}/${title}의 모든 파일 삭제가 완료되었습니다.`));
  }
}
