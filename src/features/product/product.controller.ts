import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationResult, WebResponse } from 'src/models/web.model';
import { Product } from '@prisma/client';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '../../models/product.model';
import { ResponseMessageService } from 'src/services/response-message.service';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private responseMessageService: ResponseMessageService,
  ) {}

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async get(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<WebResponse<PaginationResult<Product>>> {
    const products = await this.productService.getAll({ page, limit, search });
    const message = this.responseMessageService.getAll('products');
    return {
      status: true,
      statusCode: 200,
      message,
      data: products,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async getById(@Param('id') id: string): Promise<WebResponse<Product>> {
    const product = await this.productService.getById(id);
    const message = this.responseMessageService.getById('product');
    return {
      status: true,
      statusCode: 200,
      message,
      data: product,
    };
  }

  @Post()
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async post(
    @Body() request: CreateProductRequest,
  ): Promise<WebResponse<Product>> {
    const product = await this.productService.create(request);
    const message = this.responseMessageService.post('product');
    return {
      status: true,
      statusCode: 200,
      message,
      data: product,
    };
  }

  @Post('many')
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async postMany(
    @Body() request: CreateProductRequest[],
  ): Promise<WebResponse<number>> {
    const productsCreateCount = await this.productService.createMany(request);
    const message = this.responseMessageService.post('products');
    return {
      status: true,
      statusCode: 200,
      message,
      data: productsCreateCount,
    };
  }

  @Put(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async put(@Param('id') id: string, @Body() request: UpdateProductRequest) {
    if (!(request.name && request.price)) {
      throw new HttpException('Required fields are missing', 404);
    }
    const product = await this.productService.update(id, request);
    const message = this.responseMessageService.put('product');
    return {
      status: true,
      statusCode: 200,
      message,
      data: product,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async patch(
    @Param('id') id: string,
    @Body() request: UpdateProductRequest,
  ): Promise<WebResponse<Product>> {
    const product = await this.productService.update(id, request);
    const message = this.responseMessageService.patch('product');
    return {
      status: true,
      statusCode: 200,
      message,
      data: product,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async delete(@Param('id') id: string): Promise<WebResponse<{ id: string }>> {
    const product = await this.productService.delete(id);
    const message = this.responseMessageService.delete('product');
    return {
      status: true,
      statusCode: 200,
      message,
      data: product,
    };
  }
}
