import { InjectRepository } from '@nestjs/typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { User } from 'src/database/Entities/user.entity';
import { Repository } from 'typeorm';
import { IsUserAlreadyExist } from './authHelper.dto';

export class validateSignup {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Invalid email format!' })
  @IsNotEmpty()
  // @IsUserAlreadyExist({ message: 'Email already exists.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirmPassword: string;
}
