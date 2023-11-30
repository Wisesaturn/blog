export default class CustomError extends Response {
  constructor({
    message,
    name,
    statusCode,
  }: {
    message: string;
    name: string;
    statusCode: number;
  }) {
    super(message, { status: statusCode, statusText: name });
  }
}
