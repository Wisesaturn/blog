import CustomError from './CustomError';

export default class FetchFailedError extends CustomError {
  constructor() {
    super({
      message: '게시물을 불러오는 데 실패하였습니다.',
      name: 'FetchFailedError',
      statusCode: 500,
    });
  }
}
