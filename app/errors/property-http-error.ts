export class PropertyHttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'PropertyHttpError';
    this.statusCode = statusCode;
  }
}