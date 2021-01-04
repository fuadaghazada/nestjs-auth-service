import { IsNotEmpty, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../auth.constant';

export class ResetPasswordDto {
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsNotEmpty()
  new_password: string;
}
