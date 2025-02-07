import { ResponseMessageService } from 'src/services/response-message.service';
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
import { Todo } from '@prisma/client';
import { CreateTodoRequest, UpdateTodoRequest } from 'src/models/todo.model';
import { QueryResult, WebResponse } from 'src/models/web.model';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(
    private todoService: TodoService,
    private responseMessageService: ResponseMessageService,
  ) {}

  @Get()
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async get(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<WebResponse<QueryResult<Todo>>> {
    const todos = await this.todoService.getAll({ page, limit, search });

    const message = this.responseMessageService.getAll('todo');

    return {
      status: true,
      statusCode: 200,
      message,
      data: todos,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async getById(@Param('id') id: string): Promise<WebResponse<Todo>> {
    const todo = await this.todoService.getById(id);

    const message = this.responseMessageService.getById('todo');

    return {
      status: true,
      statusCode: 200,
      message,
      data: todo,
    };
  }

  @Post()
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async post(@Body() request: CreateTodoRequest): Promise<WebResponse<Todo>> {
    const todo = await this.todoService.create(request);

    const message = this.responseMessageService.post('todo');

    return {
      status: true,
      statusCode: 201,
      message,
      data: todo,
    };
  }

  @Post('many')
  @HttpCode(201)
  @Header('Content-Type', 'application/json')
  async postMany(
    @Body() request: CreateTodoRequest[],
  ): Promise<WebResponse<number>> {
    const todoCreatedCount = await this.todoService.createMany(request);

    const message = this.responseMessageService.post('todos');

    return {
      status: true,
      statusCode: 201,
      message,
      data: todoCreatedCount,
    };
  }

  @Put(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async put(
    @Param('id') id: string,
    @Body() request: UpdateTodoRequest,
  ): Promise<WebResponse<Todo>> {
    if (!(request.text && request.status)) {
      throw new HttpException(`Required fields are missing`, 404);
    }

    const todo = await this.todoService.update(id, request);

    const message = this.responseMessageService.put('todo');

    return {
      status: true,
      statusCode: 200,
      message,
      data: todo,
    };
  }

  @Patch(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async patch(
    @Param('id') id: string,
    @Body() request: UpdateTodoRequest,
  ): Promise<WebResponse<Todo>> {
    const todo = await this.todoService.update(id, request);

    const message = this.responseMessageService.patch('todo');

    return {
      status: true,
      statusCode: 200,
      message,
      data: todo,
    };
  }

  @Delete(':id')
  @HttpCode(200)
  @Header('Content-Type', 'application/json')
  async delete(@Param('id') id: string): Promise<WebResponse<{ id: string }>> {
    const todoId = await this.todoService.delete(id);

    const message = this.responseMessageService.delete('todo');

    return {
      status: true,
      statusCode: 200,
      message,
      data: todoId,
    };
  }
}
