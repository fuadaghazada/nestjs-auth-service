import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './model/user.schema';
import { CreateUserDto } from './dto/user.dto.create';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: CreateUserDto): Promise<User | undefined> {
    const userCreated = new this.userModel(user);
    return userCreated.save();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userModel.findOne({email}).exec();
  }
}
