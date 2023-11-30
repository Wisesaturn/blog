export default class CustomError extends Error {
  statusCode: number;

  name: string;

  constructor({
    message,
    name,
    statusCode,
  }: {
    message: string;
    name: string;
    statusCode: number;
  }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
