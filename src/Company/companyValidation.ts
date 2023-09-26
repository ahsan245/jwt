/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class CompanyDto {
  @IsString()
  @IsNotEmpty()
  display_name: string;

  @IsString()
  @IsNotEmpty()
  meta: string;
  
}