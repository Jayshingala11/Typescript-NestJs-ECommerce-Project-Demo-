import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Cart } from 'src/database/Entities/cart.entity';
import { CartItem } from 'src/database/Entities/cartItem.entity';
import { Order } from 'src/database/Entities/order.entity';
import { OrderItem } from 'src/database/Entities/orderItem.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private readonly stripeService: StripeService,
  ) {}

  async getCheckout(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req.session as { [key: string]: any }).user.id;
      let totalPrice: number = 0;

      const cart = await this.cartRepo.findOne({ where: { userId } });

      const cartItems = await this.cartItemRepo.find({
        where: { cartId: cart.id },
        relations: ['product'],
      });

      cartItems.forEach((item) => {
        totalPrice += item.product.price * item.quantity;
      });

      const sessionId = await this.stripeService.createSession(cartItems, req);

      res.render('checkout', { cartItems, totalPrice, sessionId });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createOrder(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req.session as { [key: string]: any }).user.id;

      const cart = await this.cartRepo.findOne({ where: { userId } });

      const cartItems = await this.cartItemRepo.find({
        where: { cartId: cart.id },
        relations: ['product'],
      });

      const order = this.orderRepo.create({ userId });
      await this.orderRepo.save(order);

      cartItems.forEach(async (item) => {
        await this.orderItemRepo.save({
          quantity: item.quantity,
          productId: item.productId,
          orderId: order.id,
        });
        await this.cartItemRepo.delete({
          cartId: item.cartId,
          productId: item.productId,
        });
      });

      res.redirect('/orders')
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
