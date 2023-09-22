/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body,Get ,Req,UseGuards, UseInterceptors, UnauthorizedException} from '@nestjs/common';

import { Request } from 'express';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserGuard } from './user.guard';
import { LoggingInterceptor, ImageUploadInterceptor } from './logging.interceptor';
import { RegisterUserDto } from './register-user.dto';
import fileUpload from 'express-fileupload';
import { FileUploadMiddleware } from 'src/middleware/user.upload';


@Controller('user')
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
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

    // Handle file upload using express-fileupload
    if (!req.files || Object.keys(req.files).length === 0) {
      throw new UnauthorizedException('No files were uploaded.');
    }

    const userImage = req.files.userImage as fileUpload.UploadedFile;

    // Move the uploaded file to your desired destination
    const filePath = `../uploads/users${userImage.name}`;
    await userImage.mv(filePath);

    const user = await this.userService.createUser(username, password, 'user', filePath);
    return { userId: user.id, username: user.username, role: user.role };
  }

  @Post('login')
  async loginUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return {message: 'Invalid credentials'};

    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
     return {message: 'Invalid credentials'};
    }
    const token = await this.userService.generateJwtToken(user);
    return { token };
  }
}

