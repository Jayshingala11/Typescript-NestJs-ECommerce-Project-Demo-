import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import Stripe from 'stripe';
dotenv.config();

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createSession(cartItems: any[], @Req() req: Request): Promise<string> {
    try {
      console.log('Hello');

      let totalPrice: number = 0;

      const lineItems = cartItems.map((cartItem) => {
        totalPrice += cartItem.product.price * cartItem.quantity;

        return {
          price_data: {
            currency: 'INR',
            product_data: {
              name: cartItem.product.title,
              description: cartItem.product.description,
            },
            unit_amount: cartItem.product.price * 100,
          },
          quantity: cartItem.quantity,
        };
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url:
          req.protocol + '://' + req.get('host') + '/order/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/order/checkout/cancel',
      });

      return session.id;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
