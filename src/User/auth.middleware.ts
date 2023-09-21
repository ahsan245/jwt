/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  async generateJwtToken(user): Promise<string> {
    const payload = { id: user.id, username: user.username, role: user.role };
    return jwt.sign(payload, 'ashen', { expiresIn: '1h' });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }
  
    try {
      const decoded = jwt.verify(token, 'ashen');
      req['user'] = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
}
