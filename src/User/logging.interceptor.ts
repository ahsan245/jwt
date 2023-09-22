/* eslint-disable prettier/prettier */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const { method, url } = request;
    const { statusCode } = response;
    console.log(`Request Received in ${now}ms for ${method} ${url}`);

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        console.log(`Request processed in ${responseTime}ms with Status ${statusCode} at ${url}`);
      }),
    );
  }
}


@Injectable()
export class ImageUploadInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const { method, url } = request;

    // Log that a request has been received for image upload
    console.log(`Image Upload Request Received in ${now}ms for ${method} ${url}`);

    // Access the uploaded file from req.body.userImage
    const userImage = request.body.userImage;

    if (userImage) {
      console.log(`Uploaded File: ${userImage.name}`);
      console.log(`File Size: ${userImage.size} bytes`);
      console.log(`MIME Type: ${userImage.mimetype}`);
    } else {
      console.log('No userImage file was uploaded.');
    }

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        console.log(`Image Upload Request processed in ${responseTime}ms with Status ${response.statusCode} at ${url}`);
      }),
    );
  }
}

