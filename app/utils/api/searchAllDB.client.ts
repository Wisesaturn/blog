import { collection, query, getDocs } from 'firebase/firestore';

import setClientFirebase from '@utils/firebase.client';
import { PRODUCTION_CATEGORY_DATA } from '@utils/constant/category';

import type { DocumentData } from 'firebase/firestore';
import type { IFirebasePostReturn } from '@Types/post';

export default async function searchAllDB({ size, env }: { size?: number; env?: any }) {
  const { db } = setClientFirebase(env);

  const allSearchData = await Promise.all(
    PRODUCTION_CATEGORY_DATA.map(async (cur) => {
      const q = query(collection(db, cur.link));

      const querySnapshot = await getDocs(q);
      const searchData = querySnapshot.docs.map((doc) => doc.data());

      return { searchData };
    }),
  );

  const combinedData = allSearchData.reduce((acc, cur) => {
    acc.searchData.push(...cur.searchData);

    return acc;
  });

  combinedData.searchData.sort((a: DocumentData, b: DocumentData) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateA < dateB ? 1 : -1;
  });

  const slicedData = size ? combinedData.searchData.slice(size) : combinedData.searchData;

  return slicedData as IFirebasePostReturn[];
}
