import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsString()
  verification_code: string;
}
