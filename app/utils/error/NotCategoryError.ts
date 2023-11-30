import CustomError from './CustomError';

export default class NotCategoryError extends CustomError {
  constructor(document: string) {
    super({
      message: `${document} 카테고리가 존재하지 않습니다`,
      name: 'NotCategoryError',
      statusCode: 400,
    });
  }
}
