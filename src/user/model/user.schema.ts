import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude, Expose } from 'class-transformer';

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Expose()
  get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
