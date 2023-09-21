/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UnauthorizedException,Get ,Req,UseGuards, UseInterceptors} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserGuard } from './user.guard';
import { LoggingInterceptor } from './logging.interceptor';
import { RegisterUserDto } from './register-user.dto';


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
  async registerUser( @Body() registerUserDTO : RegisterUserDto)
{  const {username,password} = registerUserDTO;
    const user = await this.userService.createUser(username, password, 'user');
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
