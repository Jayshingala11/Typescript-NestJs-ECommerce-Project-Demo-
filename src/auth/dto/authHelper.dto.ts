import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { User } from 'src/database/Entities/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class AuthHelperDto implements ValidatorConstraintInterface {
  public userRepo: Repository<User>;

  constructor(@InjectRepository(User) userrepo: Repository<User>) {
    this.userRepo = userrepo;
  }

  async validate(email: string) {
    console.log(email);
    console.log('this.userrepo : ', this.userRepo);

    const user = await this.userRepo.findOne({ where: { email } });
    return user === undefined;
  }
}

export function IsUserAlreadyExist(ValidationOptions: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: ValidationOptions,
      constraints: [],
      validator: AuthHelperDto,
    });
  };
}
