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
import { Category } from '@prisma/client';
import { PaginationResult, WebResponse } from 'src/models/web.model';
import { CategoryService } from './category.service';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/models/category.model';
import { ResponseMessageService } from 'src/services/response-message.service';

@Controller('categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private responseMessageService: ResponseMessageService,
  ) {}

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async get(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<WebResponse<PaginationResult<Category>>> {
    const categories = await this.categoryService.getAll({
      page,
      limit,
      search,
    });
    const message = this.responseMessageService.getAll('categories');
    return {
      status: true,
      statusCode: 200,
      message,
      data: categories,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async getById(@Param('id') id: string): Promise<WebResponse<Category>> {
    const category = await this.categoryService.getById(id);
    const message = this.responseMessageService.getById('category');
    return {
      status: true,
      statusCode: 200,
      message,
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
    const message = this.responseMessageService.post('category');
    return {
      status: true,
      statusCode: 201,
      message,
      data: category,
    };
  }

  @Post('many')
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async postMany(
    @Body() request: CreateCategoryRequest[],
  ): Promise<WebResponse<number>> {
    const categoriesCreatedCount =
      await this.categoryService.createMany(request);
    const message = this.responseMessageService.post('categories');
    return {
      status: true,
      statusCode: 201,
      message,
      data: categoriesCreatedCount,
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
    const message = this.responseMessageService.put('category');
    return {
      status: true,
      statusCode: 200,
      message,
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
    const message = this.responseMessageService.patch('category');
    return {
      status: true,
      statusCode: 200,
      message,
      data: category,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async delete(@Param('id') id: string): Promise<WebResponse<{ id: string }>> {
    const category = await this.categoryService.delete(id);
    const message = this.responseMessageService.delete('category');
    return {
      status: true,
      statusCode: 200,
      message,
      data: category,
    };
  }
}
