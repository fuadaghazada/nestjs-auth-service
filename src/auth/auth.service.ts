import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/interface/user.dto.create';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validate(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
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
      data: payload
    };
  }

  async register(user: CreateUserDto) {
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(user.password, saltOrRounds);

    return this.userService.createUser(user);
  }
}
