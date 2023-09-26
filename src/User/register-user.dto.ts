/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsString, Length, IsDefined } from 'class-validator';
import { UploadedFile } from 'express-fileupload';

export class RegisterUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(8, 20)
  password: string;

  
  @IsString()
  @Length(2, 20)
  role: string;

  @IsDefined()
  userImage: UploadedFile;

}

