import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthInterceptor } from './auth.interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post('/register')
  async register(@Body() body: RegisterDto) {
    const hashed = await bcrypt.hash(body.password, 12);

    return this.authService.create({
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      password: hashed
    });
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Res({passthrough: true}) response: Response) {
    const user = await this.authService.findOneBy({email: body.email});

    if (!user) {
      throw new BadRequestException('Email does not exists!');
    }

    if (!await bcrypt.compare(body.password, user.password)) {
      throw new BadRequestException('Invalid credentials!');
    }

    const jwt = await this.jwtService.signAsync({id: user.id});
    response.cookie('jwt', jwt, { httpOnly: true });

    return user;
  }

  @UseInterceptors(AuthInterceptor)
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);

    return await this.authService.findOneBy({ id: data.id });
  }

  @UseInterceptors(AuthInterceptor)
  @Post('logout')
  async logout(@Res({passthrough: true}) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'Success'
    }
  }
}
