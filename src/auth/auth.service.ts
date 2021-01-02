import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/interface/user.dto.create';
import * as bcrypt from 'bcrypt';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectQueue('email') private readonly emailQueue: Queue,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
  }

  async validate(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    const passwordMatch = user && await bcrypt.compare(pass, user.password);

    if (passwordMatch) {
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = {
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
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);

    const createdUser = await this.userService.createUser(user);
    await this.sendVerification(createdUser.email);

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

  private async sendVerification(email: string) {
    const verificationCode = 'CODE'; // TODO: temp

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
