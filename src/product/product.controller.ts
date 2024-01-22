import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { validateProduct } from './dto/addProduct.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/add-product')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @UseInterceptors(FileInterceptor('image'))
  async addProduct(
    @Req() req: Request,
    @Res() res: Response,
    @Body() product: validateProduct,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }
      const imageName = `${new Date().toISOString()}-${file.originalname}`;
      file.filename = imageName;
      const savePath = path.resolve(process.cwd(), 'images', imageName);
      fs.writeFileSync(savePath, file.buffer);
      await this.productService.addProduct(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/edit-product')
  @UseInterceptors(FileInterceptor('image'))
  async postEditProduct(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    try {
      await this.productService.postEditProduct(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/delete-product')
  async deleteProduct(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.productService.postDeleteProduct(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
