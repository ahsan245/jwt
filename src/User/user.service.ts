/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { User } from './user.model';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly authMiddleware: AuthMiddleware,
  ) { }

  async profile(user: User): Promise<any> {
    return {
      message: 'Profile data',
      user,
    };
  }

  // In user.service.ts

// In user.service.ts
async getUserById(id: string): Promise<User> {
  try {
    const objectId = new Types.ObjectId(id);
    const user = await this.userModel.findById(objectId);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  } catch (error) {
    throw new BadRequestException('Invalid user ID');
  }
}

  async createUser(username: string, password: string, role: string = 'user', userImage: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role,
      userImage,
    });
    return await newUser.save();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }


  async generateJwtToken(user): Promise<string> {
    const payload = { id: user.id, username: user.username, role: user.role };
    return jwt.sign(payload, 'ashen', { expiresIn: '1h' });
  }

}

