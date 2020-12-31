import { Controller, Request, Post, UseGuards, Get, Body, UsePipes, ValidationPipe, Response } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public } from './utils/auth.decorator';
import { CreateUserDto } from '../user/dto/user.dto.create';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Response({passthrough: true}) res) {
    const { jwt, data } = await this.authService.login(req.user);
    res.cookie('jwt', jwt, { httpOnly: true });

    return data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
