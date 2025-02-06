import { ZodError } from 'zod';

export class WebResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
  error?: string;
  details?: ZodError;
}

export class PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}
