import { collection, getDocs, query } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import Logger from '$shared/helper/logger';

import { IProject } from '../types/project';

interface Props {
  title: string;
}

export default async function getProject(props: Props) {
  const { title } = props;
  const metaQ = query(collection(db, 'projects', title, 'meta'));
  const bodyQ = query(collection(db, 'projects', title, 'body'));
  const queryMetaSnapshot = await getDocs(metaQ);
  const queryBodySnapshot = await getDocs(bodyQ);
  const meta = queryMetaSnapshot.docs.map((doc) => doc.data() as Omit<IProject, 'body'>);
  const body = queryBodySnapshot.docs.map((doc) => doc.data() as Pick<IProject, 'body'>);

  if (queryMetaSnapshot.empty || queryBodySnapshot.empty) {
    const NotFoundError = new Error(`${title}에 해당하는 프로젝트가 없습니다`);
    Logger.error(NotFoundError);
    throw NotFoundError;
  }

  return { ...meta[0], ...body[0] };
}
