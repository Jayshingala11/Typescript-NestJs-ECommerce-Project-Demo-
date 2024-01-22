import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfig from './database/database.config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forRoot(DatabaseConfig),
    MulterModule.register({
      storage: diskStorage({
        destination: '../images',
        filename: (req, file, cb) => {
          const fileName = `${new Date().toISOString()}-${file.originalname}`
            .trim()
            .replace(/:/g, '-');
          cb(null, fileName);
        },
      }),
    }),
    ProductModule,
    CartModule,
    OrderModule,
    StripeModule,
  ],
})
export class AppModule {}
