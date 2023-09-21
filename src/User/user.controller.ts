/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UnauthorizedException,Get ,Req,Next} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = req['user'];
    const result = await this.userService.profile(user);
    return result;
  }

  @Post('register')
  async registerUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Next() next: Function,
  ) {
    const user = await this.userService.createUser(username, password, 'user');
    next();
    return { userId: user.id, username: user.username, role: user.role };
  }

  @Post('login')
  async loginUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.userService.generateJwtToken(user);
    return { token };
  }
}
