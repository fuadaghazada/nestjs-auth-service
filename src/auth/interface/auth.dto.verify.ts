import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCode {
  @IsNotEmpty()
  @IsString()
  verification_code: string;
}
