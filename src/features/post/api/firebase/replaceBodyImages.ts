import chalk from 'chalk';

import uploadImage from './uploadImage';
import filterNotionUrl from '../../lib/filterNotionUrl';

interface Props {
  body: string;
  category: string;
  title: string;
}

/**
 * @summary body에 있는 이미지 파일을 firebase에 업로드하는 함수
 * @param props
 * @returns
 */
export default async function replaceBodyImages(props: Props): Promise<string> {
  const { body, category, title } = props;
  // find base url
  const imgSrcArray = filterNotionUrl(body);

  try {
    if (imgSrcArray.length === 0) {
      console.log(chalk.yellow(`[WARN] 업로드할 이미지 파일이 존재하지 않습니다.`));
      return body;
    }

    const convertImgSrcArray = await Promise.all(
      imgSrcArray.map(async (src) => {
        const convertSrc = await uploadImage({
          src,
          category,
          title,
        });
        return convertSrc;
      }),
    );

    const modifiedBody = imgSrcArray.reduce(
      (acc, imgSrc, index) => acc.replace(imgSrc, convertImgSrcArray[index]),
      body,
    );

    console.log(chalk.green(`[SUCCESS] 이미지 업로드에 성공하였습니다.`));

    return modifiedBody;
  } catch (err) {
    console.log(chalk.red(`[ERROR] 이미지 업로드에 실패하였습니다.`));
    throw err;
  }
}
