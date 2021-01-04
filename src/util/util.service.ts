import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const saltOrRounds = 10;

@Injectable()
export class UtilService {
  constructor() {}

  generateRandomCode(length: number = 6) {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, saltOrRounds);
  }

  async checkPassword(enteredPassword: string, password: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, password);
  }
}
