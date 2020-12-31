import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from 'mongoose';

export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response
      .status(400)
      .json({
        statusCode: 400,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
