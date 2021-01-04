import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.schema';
import { CreateUserDto } from './interface/user.dto.create';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async createUser(user: CreateUserDto): Promise<User | undefined> {
    const userCreated = new this.userModel(user);
    return userCreated.save();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  async updatePassword(id: string, password: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id);
    if (user) {
      user.password = password;
      await user.save();
    }
    return user;
  }
}
