import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getIndex(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.userService.getIndex(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/')
  async postIndex(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.userService.getIndex(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/cart')
  getCart(@Req() req: Request, @Res() res: Response): void {
    this.userService.getCart(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/orders')
  async getOrders(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.userService.getOrders(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/add-product')
  getAddProduct(@Req() req: Request, @Res() res: Response): void {
    this.userService.getAddProduct(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/admin-products')
  async getAdminProducts(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.userService.getAdminProducts(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
