import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  private readonly SLOW_REQUEST_THRESHOLD = 1000; // 1 second

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = performance.now();

    return next.handle().pipe(
      map((data: unknown) => {
        const duration = Math.floor(performance.now() - startTime);
        const logMessage = `${request.method}, url: ${request.url},statusCode: ${response.statusCode},duration: ${duration}ms`;
        if (duration > this.SLOW_REQUEST_THRESHOLD)
          this.logger.warn('Slow Request Detected', logMessage);
        return data;
      }),
    );
  }
}
