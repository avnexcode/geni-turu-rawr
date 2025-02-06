import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { CreateTodoRequest, UpdateTodoRequest } from 'src/models/todo.model';
import { PaginationParams, PaginationResult } from 'src/models/web.model';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class TodoRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll(params: PaginationParams): Promise<PaginationResult<Todo>> {
    const { page = 1, limit = 10, search = '' } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaService.todo.findMany({
        where: {
          OR: [
            {
              text: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prismaService.todo.count({
        where: {
          OR: [
            {
              text: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
        limit,
      },
    };
  }

  async findUniqueId(id: string): Promise<Todo | null> {
    const todo = await this.prismaService.todo.findUnique({
      where: { id },
    });

    return todo;
  }

  async countMany(): Promise<number> {
    const todosCount = await this.prismaService.todo.count();
    return todosCount;
  }

  async insert(request: CreateTodoRequest): Promise<Todo> {
    const todo = await this.prismaService.todo.create({ data: request });
    return todo;
  }

  async insertMany(requeset: CreateTodoRequest[]): Promise<number> {
    const todos = await this.prismaService.todo.createMany({
      data: requeset,
      skipDuplicates: true,
    });
    return todos.count;
  }

  async update(id: string, request: UpdateTodoRequest): Promise<Todo> {
    const todo = await this.prismaService.todo.update({
      where: { id },
      data: request,
    });

    return todo;
  }

  async destroy(id: string): Promise<Todo> {
    const todo = await this.prismaService.todo.delete({ where: { id } });
    return todo;
  }
}
