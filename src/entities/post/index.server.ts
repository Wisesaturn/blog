// Firestore 를 부르는 서버 전용 API. 이름의 .server 때문에 클라이언트 번들에 섞이면 빌드가 실패한다
export { getPost, getPosts, increasePostViews, updatePost } from './api/apis';
