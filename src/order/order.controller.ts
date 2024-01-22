import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderSevice: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/checkout')
  async getCheckout(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.orderSevice.getCheckout(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/checkout/success')
  async createOrder(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.orderSevice.createOrder(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
