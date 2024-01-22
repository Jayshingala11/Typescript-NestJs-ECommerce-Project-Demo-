import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class validateProduct {
  @MinLength(3, { message: 'Enter title atleast 3 character!' })
  @IsString()
  @IsNotEmpty()
  title: string;

  // @IsInt()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3, { message: 'Enter description atleast 3 character!' })
  description: string;
}
