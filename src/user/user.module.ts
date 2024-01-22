import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/Entities/product.entity';
import { Order } from 'src/database/Entities/order.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Product, Order])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
