export class AppError extends Error {
  public readonly isOperational = true;

  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'AppError';
  }
}
