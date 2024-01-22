import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { User } from './Entities/user.entity';
import { Product } from './Entities/product.entity';
import { Cart } from './Entities/cart.entity';
import { CartItem } from './Entities/cartItem.entity';
import { Order } from './Entities/order.entity';
import { OrderItem } from './Entities/orderItem.entity';
import { Session } from './Entities/session.entity';
dotenv.config();

const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASS,
  database: 'nestJs DB',
  entities: [User, Product, Cart, CartItem, Order, OrderItem, Session],
  synchronize: true,
};

export default DatabaseConfig;
