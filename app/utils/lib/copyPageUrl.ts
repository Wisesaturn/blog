const copyPageUrl = () => {
  const copyText = decodeURI(window.location.href) as string;
  navigator.clipboard
    .writeText(copyText)
    .then(() => {
      console.log('페이지 주소가 성공적으로 복사되었습니다.');
    })
    .catch(() => {
      console.error('페이지 주소 복사에 실패하였습니다.');
    });
};

export default copyPageUrl;
