/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Req, UseGuards, UseInterceptors, UnauthorizedException, UploadedFile, BadRequestException } from '@nestjs/common';

import { Request } from 'express';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserGuard } from './user.guard';
import { LoggingInterceptor, ImageUploadInterceptor } from './logging.interceptor';
import { RegisterUserDto } from './register-user.dto';
import { FileUploadMiddleware } from '../middleware/user.upload';

import { FileInterceptor } from '@nestjs/platform-express';
import * as  fileUpload from 'express-fileupload';


@Controller('user')
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('profile')
  @UseGuards(UserGuard)
  async getProfile(@Req() req: Request) {
    const user = req['user'];
    const result = await this.userService.profile(user);
    return result;
  }
  @Post('register')
  async create(@Req() req: Request) {

    if (!req.files || !req.files.file) {
      throw new BadRequestException('No file uploaded.');
    }
    const uploadedFile = req.files.file as fileUpload.UploadedFile;

    const filePath = `./uploads/${uploadedFile.name}`;


    const user = await this.userService.createUser(req.body.username, req.body.password, 'user', filePath);
    await uploadedFile.mv(filePath);
    return { userId: user.id, username: user.username, role: user.role, file: user.file };
  }
  @Post('upload')
  async uploadFile(@Req() req: Request) {
    if (!req.files || !req.files.file) {
      throw new BadRequestException('No file uploaded.');
    }

    const uploadedFile = req.files.file as fileUpload.UploadedFile;

    const filePath = `./userUploads/${uploadedFile.name}`;
    await uploadedFile.mv(filePath);

    // Save the file to disk or process it further
    // ...

    return { message: 'File uploaded successfully.' };
  }

  @Post('login')
  async loginUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return { message: 'Invalid credentials' };

    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: 'Invalid credentials' };
    }
    const token = await this.userService.generateJwtToken(user);
    return { token };
  }
}

