import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Cart } from 'src/database/Entities/cart.entity';
import { CartItem } from 'src/database/Entities/cartItem.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  async addCart(req: Request, res: Response): Promise<any> {
    try {
      const { prodId } = req.body;
      const userId = (req.session as { [key: string]: any }).user.id;
      let newQuantity: number = req.body.quantity || 1;

      const cart = await this.cartRepo.findOne({ where: { userId } });

      const cartItems = req.body.cartItem || [];

      if (cartItems.length) {
        for (const cartItem of cartItems) {
          const prodId = cartItem.id;
          let newQuantity: number = +cartItem.quantity || 1;

          let cartItems = await this.cartItemRepo.find({
            where: { cartId: cart.id, productId: prodId },
          });

          if (cartItems.length) {
            cartItems[0].quantity += newQuantity;
            await this.cartItemRepo.save(cartItems[0]);
          } else {
            const cartItem = this.cartItemRepo.create({
              quantity: newQuantity,
              cartId: cart.id,
              productId: prodId,
            });
            await this.cartItemRepo.save(cartItem);
          }
        }
      } else {
        let cartItem = await this.cartItemRepo.find({
          where: { cartId: cart.id, productId: prodId },
        });

        if (cartItem.length) {
          cartItem[0].quantity += newQuantity;
          await this.cartItemRepo.save(cartItem[0]);
        } else {
          const cartItem = this.cartItemRepo.create({
            quantity: newQuantity,
            cartId: cart.id,
            productId: prodId,
          });
          await this.cartItemRepo.save(cartItem);
        }
      }

      res.status(200).json({ success: true, message: 'Cart Item Added' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getCart(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req.session as { [key: string]: any }).user.id;

      const cart = await this.cartRepo.findOne({ where: { userId } });

      const cartItems = await this.cartItemRepo.find({
        where: { cartId: cart.id },
        relations: ['product'],
      });

      res.status(200).json({ success: true, cartItems });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteCartItem(req: Request, res: Response): Promise<any> {
    try {
      const { prodId } = req.body;
      const userId = (req.session as { [key: string]: any }).user.id;

      const cart = await this.cartRepo.findOne({ where: { userId } });

      await this.cartItemRepo.delete({ cartId: cart.id, productId: prodId });

      res.status(200).json({ success: true, message: 'Cart Item Deleted' });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
