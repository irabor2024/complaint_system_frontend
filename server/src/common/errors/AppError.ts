export type AppErrorOptions = {
  /** Extra structured context (safe to expose to the client when intentional). */
  details?: unknown;
  /** Per-field messages for forms (e.g. from validation). */
  fieldErrors?: Record<string, string[]>;
};

export class AppError extends Error {
  public readonly isOperational = true;
  public readonly details?: unknown;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    options?: AppErrorOptions
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = 'AppError';
    this.details = options?.details;
    this.fieldErrors = options?.fieldErrors;
  }
}
