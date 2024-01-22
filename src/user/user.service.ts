import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Order } from 'src/database/Entities/order.entity';
import { Product } from 'src/database/Entities/product.entity';
import { Repository } from 'typeorm';
const itemsPerPage = 2;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async getIndex(req: Request, res: Response): Promise<any> {
    try {
      const page: number = +req.body.page || 1;
      const startLimit: number = (page - 1) * itemsPerPage;
      let ajax: boolean;
      if (req.body.isajax) {
        ajax = true;
      }

      const products = await this.productRepo.findAndCount({
        skip: startLimit,
        take: itemsPerPage,
      });

      const totalPages = Math.ceil(products[1] / itemsPerPage);

      const pagination = {
        totalPages,
        currentPage: page,
        itemsPerPage,
      };

      if (ajax) {
        return res
          .status(200)
          .json({ success: true, data: products, pagination });
      }

      res.render('home', {
        PageTitle: 'Home',
        products,
        totalPages,
        isAuthenticated: res.locals.isAuthenticated,
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getCart(req: Request, res: Response): void {
    res.render('cart', { PageTitle: 'Cart' });
  }

  async getOrders(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req.session as { [key: string]: any }).user.id;

      const orders = await this.orderRepo.find({
        where: { userId },
        relations: { orderItems: { product: true } },
      });

      res.render('order', { PageTitle: 'Orders', orders });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  getAddProduct(req: Request, res: Response): void {
    res.render('add-product', { PageTitle: 'Add Product' });
  }

  async getAdminProducts(req: Request, res: Response): Promise<any> {
    try {
      const userId =
        req.query.userId || (req.session as { [key: string]: any }).user.id;

      const products = await this.productRepo.find({ where: { userId } });

      res.render('admin-products', { PageTitle: 'Admin Products', products });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
