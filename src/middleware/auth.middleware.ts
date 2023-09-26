/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthMiddleware implements NestMiddleware {


  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    try {
      const decoded = jwt.verify(token, 'ashen');
      const role = decoded['role'];
      req['user'] = decoded;

      if (role !== 'admin') {
        return res.status(403).json({ message: 'User is not authorized to access this resource' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
  }

