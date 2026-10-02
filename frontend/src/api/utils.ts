export class APIError extends Error {
  public status: number;
  public data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);

    this.name = 'APIError';
    
    this.status = status;
    this.data = data;
  }
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong',
) {
  return error instanceof Error && error.message ? error.message : fallback;
}
