export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T | T[];
  error?: string;
}
