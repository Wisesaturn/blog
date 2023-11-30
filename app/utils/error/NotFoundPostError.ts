import CustomError from './CustomError';

export default class NotFoundPostError extends CustomError {
  constructor() {
    super({
      message: '게시물을 찾을 수 없습니다.',
      name: 'NotFoundPostError',
      statusCode: 404,
    });
  }
}
