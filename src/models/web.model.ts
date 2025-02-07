import { ZodError } from 'zod';

export class WebResponse<T = undefined> {
  status: boolean;
  statusCode: number;
  message: string;
  data?: T extends undefined ? never : T;
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
  meta: QueryMeta;
}

export class QueryMeta {
  total: number;
  page: number;
  last_page: number;
  limit: number;
}
