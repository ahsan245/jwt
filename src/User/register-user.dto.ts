import { IsString, Length, IsDefined } from 'class-validator';
import { UploadedFile } from 'express-fileupload';

export class RegisterUserDto {
  @IsString()
  @Length(4, 20)
  username: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsDefined()
  file: UploadedFile; // Field to accept the uploaded file

  constructor(username: string, password: string, file: UploadedFile) {
    this.username = username;
    this.password = password;
    this.file = file;
  }
}