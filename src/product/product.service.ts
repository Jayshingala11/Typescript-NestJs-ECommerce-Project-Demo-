import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Product } from 'src/database/Entities/product.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async addProduct(req: Request, res: Response): Promise<any> {
    try {
      const { title, price, description } = req.body;
      const image = req.file;
      const userId = (req.session as { [key: string]: any }).user.id;

      if (!image) {
        return res.status(422).render('add-product', {
          error: 'Please select an image',
          product: { title, price, description },
        });
      }

      const imageUrl = `/${image.filename}`;

      const product = this.productRepo.create({
        title,
        price,
        description,
        imageUrl,
        userId,
      });

      await this.productRepo.save(product);

      res.redirect('/admin-products');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postEditProduct(req: Request, res: Response): Promise<any> {
    try {
      const { prodId, title, price, description } = req.body;
      const image = req.file;

      const product = await this.productRepo.findOne({ where: { id: prodId } });

      product.title = title;
      product.price = price;
      product.description = description;

      if (image) {
        const deleteImage = product.imageUrl.split('/')[1];
        const deletePath = path.resolve(process.cwd(), 'images', deleteImage);
        const newImage = `${new Date().toISOString()}-${image.originalname}`;
        fs.unlink(deletePath, (err) => {
          if (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          }
          product.imageUrl = `/${newImage}`;
        });
        fs.writeFileSync(
          path.resolve(process.cwd(), 'images', newImage),
          image.buffer,
        );
      }

      await this.productRepo.save(product);

      res.redirect('/admin-products');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postDeleteProduct(req: Request, res: Response): Promise<any> {
    try {
      const { prodId } = req.body;

      const product = await this.productRepo.findOne({ where: { id: prodId } });

      const deleteImage = product.imageUrl.split('/')[1];
      const deletePath = path.resolve(process.cwd(), 'images', deleteImage);

      fs.unlink(deletePath, (err) => {
        if (err) {
          throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      });

      await this.productRepo.delete(prodId);

      res.status(200).json({
        success: true,
        message: 'Product Deleted Successfully',
      });
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
