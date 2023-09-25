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
import fileUpload from 'express-fileupload';


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
  async create(@Req() req: Request, @Body() registerUserDTO: RegisterUserDto) {
    const { username, password } = registerUserDTO;

    if (!req.files || !req.files.userImage) {
      throw new BadRequestException('No file uploaded.');
    }

    const uploadedFile = req.files.userImage as fileUpload.UploadedFile;

    // Call the file upload middleware to handle the file upload
    await FileUploadMiddleware(req, null, async (err?: any) => {
      if (err) {
        throw new UnauthorizedException(err);
      }

      const filePath = `./userUploads/${uploadedFile.name}`;

      const user = await this.userService.createUser(username, password, 'user', filePath);
      return { userId: user.id, username: user.username, role: user.role };
    });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    // Handle file upload using multer
    if (!file) {
      throw new UnauthorizedException('No files were uploaded.');
    }

    // Move the uploaded file to your desired destination
    const filePath = `./userUploads/${file.filename}`;


    // Do something with the file, such as saving it to a database or processing it in some way
    // ...

    return { filename: file.filename, path: filePath };
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

