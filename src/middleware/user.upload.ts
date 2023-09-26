/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
   if (!req.files || !req.files.userImage) {
  return next(new BadRequestException('No file uploaded.'));
}

const file = Array.isArray(req.files.userImage) ? req.files.userImage[0] : req.files.userImage;

if (!file.mimetype.startsWith('image/')) {
  return next(new BadRequestException('Only images are allowed.'));
}
    next();
  }
}

