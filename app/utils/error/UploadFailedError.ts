import CustomError from './CustomError';

export default class UploadFailedError extends CustomError {
  constructor() {
    super({
      message: '게시물을 업로드하는 데 실패하였습니다.',
      name: 'UploadFailedError',
      statusCode: 500,
    });
  }
}
