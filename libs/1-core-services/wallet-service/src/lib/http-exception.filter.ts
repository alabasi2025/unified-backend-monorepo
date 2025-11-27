import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as Record<string, any>)
        : { message: 'Internal server error' };

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const logMessage = `
      Request Method: ${request.method}
      Request URL: ${request.url}
      Status Code: ${status}
      Error Message: ${message}
      Stack Trace: ${
        exception instanceof Error ? exception.stack : 'No stack trace available'
      }
    `;

    this.logger.error(logMessage);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorResponse.message || message,
    });
  }
}
