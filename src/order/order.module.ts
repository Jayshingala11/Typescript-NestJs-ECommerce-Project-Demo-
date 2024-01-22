import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/database/Entities/cart.entity';
import { CartItem } from 'src/database/Entities/cartItem.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { Order } from 'src/database/Entities/order.entity';
import { OrderItem } from 'src/database/Entities/orderItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Order, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService, StripeService],
})
export class OrderModule {}
