import path from 'path';
import fs from 'fs';

import sharp from 'sharp';

import Logger from '$shared/helper/logger';
import convertString from '$shared/lib/convertString';

interface Props {
  savePath: string;
  title: string;
  url: string;
}

/**
 * 주어진 URL에서 파일을 다운로드하여 public 폴더에 저장하는 함수입니다
 */
export default async function createImageOnUrl({ savePath, title, url }: Props) {
  const originPath = `${convertString(savePath, 'spaceToDash')}/${convertString(title, 'spaceToDash')}`;
  const filePath = path.resolve(process.cwd(), 'public', originPath);
  const fullPath = `${filePath}.webp`;

  // 파일이 이미 존재하는지 확인
  if (fs.existsSync(fullPath)) {
    Logger.warn(`기존 썸네일로 사용: ${fullPath}`);
    return `https://jaehan.blog/${originPath}.webp`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const DownloadError = new Error(`파일 다운로드 실패 ${response.statusText}`);
    Logger.error(DownloadError);
    throw DownloadError;
  }

  try {
    const blob = await response.blob(); // blob으로 변환
    const arrayBuffer = await blob.arrayBuffer(); // Blob을 ArrayBuffer로 변환
    const buffer = Buffer.from(arrayBuffer); // ArrayBuffer를 Node.js의 Buffer로 변환

    // `sharp`로 바로 변환하고 로컬에 `webp` 파일만 저장
    await sharp(buffer).withMetadata().toFormat('webp', { quality: 90 }).toFile(fullPath);

    Logger.success(`파일 변환 및 저장 완료: ${fullPath}`);
  } catch (error) {
    const ConversionError = new Error(`파일 변환 오류`, { cause: error });
    Logger.error(ConversionError);
    throw ConversionError;
  }

  return `https://jaehan.blog/${originPath}.webp`;
}
