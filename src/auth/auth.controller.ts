import { Controller, Req, Res, Post, UseGuards, Get, Body } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './utils/auth.decorator';
import { CreateUserDto } from '../user/interface/user.dto.create';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({passthrough: true}) res) {
    const { jwt, data } = await this.authService.login(req.user);
    res.cookie('jwt', jwt, { httpOnly: true });

    return data;
  }

  @Get('me')
  async getProfile(@Req() req) {
    return req.user;
  }

  @Post('logout')
  logout(@Res({passthrough: true}) res) {
    res.clearCookie('jwt');
    return {
      statusCode: 200,
      message: "Logout successful"
    }
  }
}
