export default function isExpiredThumbnail(url: string) {
  const match = url.match(/X-Amz-Date=(\d{8}T\d{6}Z)/);
  if (match) {
    const dateString = match[1];
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(9, 11);
    const minute = dateString.substring(11, 13);
    const second = dateString.substring(13, 15);

    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    const expires = new Date(date.getTime() + 3600000); // 1시간(60분 * 60초 * 1000밀리초)
    return Date.now() > expires.getTime();
  }

  return false;
}
