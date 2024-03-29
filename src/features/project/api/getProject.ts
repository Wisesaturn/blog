import { collection, getDocs, query } from 'firebase/firestore';

import { db } from '$shared/middleware/firebase';
import convertString from '$shared/lib/convertString';
import Logger from '$shared/helper/logger';

import { IProject } from '../types/project';

interface Props {
  title: string;
}

export default async function getProject(props: Props) {
  const { title } = props;
  const convertTitle = convertString(title, 'spaceToDash');
  const metaQ = query(collection(db, 'projects', convertTitle, 'meta'));
  const bodyQ = query(collection(db, 'projects', convertTitle, 'body'));
  const queryMetaSnapshot = await getDocs(metaQ);
  const queryBodySnapshot = await getDocs(bodyQ);
  const meta = queryMetaSnapshot.docs.map((doc) => doc.data() as Omit<IProject, 'body'>);
  const body = queryBodySnapshot.docs.map((doc) => doc.data() as Pick<IProject, 'body'>);

  if (queryMetaSnapshot.empty || queryBodySnapshot.empty) {
    Logger.error(new Error(`${title}에 해당하는 프로젝트가 없습니다`));
  }

  return { ...meta[0], ...body[0] };
}
