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
import { Category } from '@prisma/client';
import { WebResponse } from 'src/models/web.model';
import { CategoryService } from './category.service';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/models/category.model';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async getAll(): Promise<WebResponse<Category[]>> {
    const categories = await this.categoryService.getAll();
    return {
      status: true,
      statusCode: 200,
      message: 'Success retrieve all categories data',
      data: categories,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async getById(@Param('id') id: string): Promise<WebResponse<Category>> {
    const category = await this.categoryService.getById(id);
    return {
      status: true,
      statusCode: 200,
      message: 'Success retrieve category data',
      data: category,
    };
  }

  @Post()
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async post(
    @Body() request: CreateCategoryRequest,
  ): Promise<WebResponse<Category>> {
    const category = await this.categoryService.create(request);
    return {
      status: true,
      statusCode: 201,
      message: 'Success create new category data',
      data: category,
    };
  }

  @Put(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async put(
    @Param('id') id: string,
    @Body() request: UpdateCategoryRequest,
  ): Promise<WebResponse<Category>> {
    const category = await this.categoryService.update(id, request);
    if (!request.name) {
      throw new HttpException('Required fields are missing', 404);
    }
    return {
      status: true,
      statusCode: 200,
      message: 'Success update category data',
      data: category,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async patch(
    @Param('id') id: string,
    @Body() request: UpdateCategoryRequest,
  ): Promise<WebResponse<Category>> {
    const category = await this.categoryService.update(id, request);
    return {
      status: true,
      statusCode: 200,
      message: 'Success update partials category data',
      data: category,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async delete(@Param('id') id: string): Promise<WebResponse<{ id: string }>> {
    const category = await this.categoryService.delete(id);
    return {
      status: true,
      statusCode: 200,
      message: 'Success delete category data',
      data: category,
    };
  }
}
