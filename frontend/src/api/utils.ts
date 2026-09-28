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
