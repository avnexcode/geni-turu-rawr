import { Module } from '@nestjs/common';
import { TodoController } from 'src/features/todo/todo.controller';
import { TodoRepository } from 'src/features/todo/todo.repository';
import { TodoService } from 'src/features/todo/todo.service';

@Module({
  providers: [TodoService, TodoRepository],
  controllers: [TodoController],
})
export class TodoModule {}
