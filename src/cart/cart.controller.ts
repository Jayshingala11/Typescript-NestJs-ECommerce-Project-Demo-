import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/add-cart')
  async postCart(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.cartService.addCart(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-cart')
  async getCart(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.cartService.getCart(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete-cartItem')
  async deleteCartItem(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.cartService.deleteCartItem(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
