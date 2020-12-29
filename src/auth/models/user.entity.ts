import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'first_name'})
  firstName: string;

  @Column({name: 'last_name'})
  lastName: string;

  @Column({unique: true})
  email: string;

  @Column()
  @Exclude()
  password: string;
}
