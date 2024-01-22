import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AuthModule } from 'src/auth/auth.module';
import * as multer from 'multer';
import { fileFilter, fileStorage } from './multer.config';
import { NextFunction } from 'express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/database/Entities/product.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        console.log('Middleware :::');

        multer({ storage: fileStorage, fileFilter: fileFilter }).single(
          'image',
        );
      })
      .forRoutes({ path: 'add-product', method: RequestMethod.POST });
  }
}
