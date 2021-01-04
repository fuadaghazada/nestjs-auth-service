import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../../auth/auth.constant';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  password: string;
}
