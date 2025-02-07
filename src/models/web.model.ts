import { ZodError } from 'zod';

export class WebResponse<T> {
  status: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  details?: ZodError;
}

export class QueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export class QueryResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}
