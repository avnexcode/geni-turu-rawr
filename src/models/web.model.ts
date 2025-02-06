import { ZodError } from 'zod';

export class WebResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  error?: string;
  details?: ZodError;
}
