import CustomError from './CustomError';

export default class DeleteFailedError extends CustomError {
  constructor(item: string) {
    super({
      message: `${item} 삭제에 실패했습니다.`,
      name: 'DeleteFailedError',
      statusCode: 500,
    });
  }
}
