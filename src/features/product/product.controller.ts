import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { WebResponse } from 'src/models/web.model';
import { Product } from '@prisma/client';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '../../models/product.model';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async get(): Promise<WebResponse<Product[]>> {
    const products = await this.productService.getAll();
    return {
      status: true,
      statusCode: 200,
      message: 'Success retrieve all products data',
      data: products,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async getById(@Param('id') id: string): Promise<WebResponse<Product>> {
    const product = await this.productService.getById(id);
    return {
      status: true,
      statusCode: 200,
      message: 'Success retrieve product data',
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
    return {
      status: true,
      statusCode: 200,
      message: 'Success create new product data',
      data: product,
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
    return {
      status: true,
      statusCode: 200,
      message: 'Success update product data',
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
    return {
      status: true,
      statusCode: 200,
      message: 'Success update partials product data',
      data: product,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async delete(@Param('id') id: string): Promise<WebResponse<{ id: string }>> {
    const product = await this.productService.delete(id);
    return {
      status: true,
      statusCode: 200,
      message: 'Success delete product data',
      data: product,
    };
  }
}
