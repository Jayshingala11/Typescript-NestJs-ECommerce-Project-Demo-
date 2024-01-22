import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { validateSignup } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  async getLogin(@Req() req: Request, @Res() res: Response): Promise<any> {
    this.authService.getLogin(req, res);
  }

  @Get('/signup')
  getSignup(@Req() req: Request, @Res() res: Response): void {
    this.authService.getSignup(req, res);
  }

  @Post('postSignup')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  async postSignup(
    @Req() req: Request,
    @Res() res: Response,
    @Body() user: validateSignup,
  ): Promise<any> {
    try {
      await this.authService.postSignup(req, res);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('postLogin')
  async postLogin(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.authService.postLogin(req, res);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    try {
      await this.authService.postLogout(req, res);
    } catch (error) {
      throw new HttpException(error.response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
