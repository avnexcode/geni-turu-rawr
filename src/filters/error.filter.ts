import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: ZodError | HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      response.status(status).json({
        status: false,
        statusCode: status,
        errors:
          typeof errorResponse === 'string'
            ? { message: errorResponse }
            : errorResponse,
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        status: false,
        statusCode: 400,
        errors: 'Validation Error',
        details: exception.errors,
      });
    } else {
      // Handle generic errors
      response.status(500).json({
        status: false,
        statusCode: 500,
        errors: exception.message || 'Internal Server Error',
      });
    }
  }
}
