/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthMiddleware } from './auth.middleware';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authMiddleware: AuthMiddleware,
  ) {}

  async profile(user: User): Promise<any> {
    return {
      message: 'Profile data',
      user,
    };
  }

  async createUser(username: string, password: string, role: string = 'user'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role,
    });
    return await newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async generateJwtToken(user: User): Promise<string> {
    return this.authMiddleware.generateJwtToken(user);
  }
}