const sharePage = () => {
  if (navigator.share) {
    navigator
      .share({
        title: document.title,
        url: window.location.href,
      })
      .then(() => {
        console.log('페이지 공유 성공');
      })
      .catch((error) => {
        console.error('페이지 공유 실패:', error);
      });
  } else {
    alert('이 브라우저는 공유 기능을 지원하지 않습니다.');
  }
};

export default sharePage;
