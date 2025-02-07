import { HttpException, Injectable } from '@nestjs/common';
import { TodoRepository } from './todo.repository';
import { Todo } from '@prisma/client';
import { CreateTodoRequest, UpdateTodoRequest } from 'src/models/todo.model';
import { ValidationService } from 'src/services/validation.service';
import { TodoValidation } from 'src/validations/todo.validation';
import { QueryParams, QueryResult } from 'src/models/web.model';

@Injectable()
export class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private validationService: ValidationService,
  ) {}

  async getAll(params: QueryParams): Promise<QueryResult<Todo>> {
    const todos = await this.todoRepository.findAll(params);

    return todos;
  }

  async getById(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findUniqueId(id);

    if (!todo) {
      throw new HttpException(`Todo with id : ${id} not found`, 404);
    }

    return todo;
  }

  async countAll(): Promise<number> {
    const todosCount = await this.todoRepository.countMany();
    return todosCount;
  }

  async create(request: CreateTodoRequest): Promise<Todo> {
    const validatedRequest = this.validationService.validate(
      TodoValidation.CREATE_TODO_REQUEST,
      request,
    );

    const todo = await this.todoRepository.insert(validatedRequest);

    return todo;
  }

  async createMany(requests: CreateTodoRequest[]): Promise<number> {
    const validatedRequests = requests.map((request) =>
      this.validationService.validate(
        TodoValidation.CREATE_TODO_REQUEST,
        request,
      ),
    );

    const todosCreatedCount =
      await this.todoRepository.insertMany(validatedRequests);

    return todosCreatedCount;
  }

  async update(id: string, request: UpdateTodoRequest): Promise<Todo> {
    const validatedRequest = this.validationService.validate(
      TodoValidation.UPDATE_TODO_REQUEST,
      request,
    );

    const todo = await this.todoRepository.update(id, validatedRequest);

    return todo;
  }

  async delete(id: string): Promise<{ id: string }> {
    await this.getById(id);

    await this.todoRepository.destroy(id);

    return { id };
  }
}
