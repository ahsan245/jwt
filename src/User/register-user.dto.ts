import { IsString, Length } from 'class-validator';
import { UploadedFile } from 'express-fileupload';

export class RegisterUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(8, 20)
  password: string;

  userImage: UploadedFile; // Field to accept the uploaded file
}