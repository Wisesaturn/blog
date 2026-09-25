import { collection, getDocs, query } from 'firebase/firestore';

import { db } from '@/commons/api/firebase';
import Logger from '@/commons/lib/logger';
import { parseDocument } from '@/commons/lib/firestoreDocument';

import { projectBody, projectMeta } from '../model/projectDocument';

interface Props {
  title: string;
}

export default async function getProject(props: Props) {
  const { title } = props;
  const metaQ = query(collection(db, 'projects', title, 'meta'));
  const bodyQ = query(collection(db, 'projects', title, 'body'));
  const queryMetaSnapshot = await getDocs(metaQ);
  const queryBodySnapshot = await getDocs(bodyQ);

  if (queryMetaSnapshot.empty || queryBodySnapshot.empty) {
    const NotFoundError = new Error(`${title}에 해당하는 프로젝트가 없습니다`);
    Logger.error(NotFoundError);
    throw NotFoundError;
  }

  return {
    ...parseDocument(projectMeta, queryMetaSnapshot.docs[0]),
    ...parseDocument(projectBody, queryBodySnapshot.docs[0]),
  };
}
