import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'express-handlebars';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { Request, Response, NextFunction } from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import createMemoryStore = require('memorystore');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'images'));
  app.engine(
    'hbs',
    hbs.engine({
      extname: 'hbs',
      defaultLayout: 'main',
      layoutsDir: join(__dirname, '..', 'views/layouts'),
    }),
  );
  app.use(cookieParser());
  app.setViewEngine('hbs');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  const MemoryStore = createMemoryStore(session);
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 60 * 1000 },
      store: new MemoryStore({ checkPeriod: 3600 }),
    }),
  );
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('IsLogin', (req.session as { [key: string]: any })?.isLoggedIn);

    res.locals.isAuthenticated =
      (req.session as { [key: string]: any })?.isLoggedIn || false;
    next();
  });
  await app.listen(3001);
}
bootstrap();
