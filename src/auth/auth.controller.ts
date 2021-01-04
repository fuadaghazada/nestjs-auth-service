import { Controller, Req, Res, Post, UseGuards, Get, Body, Param, Put } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from '../util/util.decorator';
import { CreateUserDto } from '../user/interface/user.dto.create';
import { VerifyCodeDto } from './interface/auth.dto.verify';
import { SendEmailDto } from './interface/auth.dto.send-email';
import { ResetPasswordDto } from './interface/auth.dto.reset-password';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Get('me')
  async getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
    const { jwt, data } = await this.authService.login(req.user);
    res.cookie('jwt', jwt, { httpOnly: true });

    return data;
  }

  @Public()
  @Post('send_verification')
  async sendVerification(@Body() body: SendEmailDto) {
    return this.authService.sendVerification(body.email);
  }

  @Public()
  @Post('verify/:id')
  async verify(@Param('id') id: string,
               @Body() body: VerifyCodeDto,
               @Res({ passthrough: true }) res) {
    const user = await this.authService.verify(id, body.verification_code);
    const { jwt, data } = await this.authService.login(user);
    res.cookie('jwt', jwt, {httpOnly: true});

    return data;
  }

  @Put('reset_password')
  async resetPassword(@Req() req, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(req.user.id, body.new_password);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('jwt');
    return {
      statusCode: 200,
      message: 'Logout successful',
    };
  }
}
