import CustomError from './CustomError';

export default class NotFoundError extends CustomError {
  constructor() {
    super({
      message: '페이지를 찾을 수 없습니다.',
      name: 'NotFoundError',
      statusCode: 404,
    });
  }
}
