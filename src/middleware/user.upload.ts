import { Injectable, NestMiddleware } from '@nestjs/common';
import * as fileUpload from 'express-fileupload';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    fileUpload({
      createParentPath: true,
      limits: {
        fileSize: 1024 * 1024 * 10 // 10MB
      }
    })(req, res, next);
  }
}