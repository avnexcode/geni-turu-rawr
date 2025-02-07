import { Controller, Get, Header, HttpCode } from '@nestjs/common';
import { WebResponse } from 'src/models/web.model';

@Controller('/')
export class AppController {
  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  get(): WebResponse {
    return {
      status: true,
      statusCode: 200,
      message: 'Welcome to Rawr API 🚀 - Release Version 1.0.0',
    };
  }
}
