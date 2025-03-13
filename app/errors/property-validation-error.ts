export class PropertyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PropertyValidationError';
  }
}