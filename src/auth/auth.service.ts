import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { User } from 'src/database/Entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cart } from 'src/database/Entities/cart.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    private jwtService: JwtService,
  ) {}

  async getLogin(req: Request, res: Response): Promise<any> {
    res.render('login', { PageTitle: 'Login' });
  }

  getSignup(req: Request, res: Response): void {
    res.render('signup', { PageTitle: 'Signup' });
  }

  async postSignup(req: Request, res: Response): Promise<any> {
    try {
      const { name, email, password } = req.body;

      const isUserExist = await this.userRepo.findOne({ where: { email } });

      if (isUserExist) {
        return res
          .status(200)
          .json({ success: false, error: 'Email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      console.log(hashedPassword);

      const user = this.userRepo.create({
        name,
        email,
        password: hashedPassword,
      });

      await this.userRepo.save(user);

      await this.cartRepo.save(this.cartRepo.create({ user }));

      res.status(200).json({ success: true, msg: 'Signup Successfull.' });
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postLogin(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;

      const user = await this.userRepo.findOne({ where: { email } });

      if (!user) {
        return res
          .status(200)
          .json({ success: false, error: 'Invalid email or password!.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(200)
          .json({ success: false, error: 'Invalid email or password!.' });
      }

      (req.session as { [key: string]: any }).isLoggedIn = true;
      (req.session as { [key: string]: any }).user = user;
      req.session.save((err) => {
        console.log(err);
      });

      const payload = {
        id: user.id,
        username: user.name,
      };
      const token = this.jwtService.sign(payload);

      res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });

      res.status(200).json({ success: true, data: user.id });
    } catch (error) {
      console.log(error);

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async postLogout(req: Request, res: Response): Promise<any> {
    try {
      res.clearCookie('jwt');
      req.session.destroy((err) => {
        res.redirect('/auth/login');
      });
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
