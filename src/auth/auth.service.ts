import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { UserService } from '../user/user.service';
import { UtilService } from '../util/util.service';
import { CreateUserDto } from '../user/interface/user.dto.create';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private utilService: UtilService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
  }

  async validate(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await this.utilService.checkPassword(pass, user.password)) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return {
      jwt: this.jwtService.sign(payload),
      data: payload,
    };
  }

  async register(user: CreateUserDto) {
    user.password = await this.utilService.hashPassword(user.password);

    const createdUser = await this.userService.createUser(user);
    await this.sendVerificationEmail(createdUser.email);

    return createdUser;
  }

  async verify(id: string, code: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new Error('No user found with the id');
    }

    await this.verifyCode(user.email, code);

    return user;
  }

  async sendVerification(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new Error('No user found with the email');
    }

    await this.sendVerificationEmail(user.email);

    return user;
  }

  async resetPassword(id: string, newPassword: string) {
    const hashedNewPassword = await this.utilService.hashPassword(newPassword);
    const user = await this.userService.updatePassword(id, hashedNewPassword);

    if (!user) {
      throw new Error('No user found');
    }

    return user;
  }

  private async sendVerificationEmail(email: string) {
    const verificationCode = this.utilService.generateRandomCode();

    await this.cacheManager.set(email, verificationCode, { ttl: 100 });
    await this.emailQueue.add('send_verification_email', {
      email,
      code: verificationCode,
    });
  }

  private async verifyCode(email: string, code: string) {
    const actualCode = await this.cacheManager.get(email);

    if (!actualCode) {
      throw new Error('Verification code expired');
    }

    if (code !== actualCode) {
      throw new Error('Invalid code');
    }
  }
}
