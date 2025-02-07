import { z } from 'zod';

export const createTodoRequest = z.object({
  text: z.string().min(1).max(100).toLowerCase(),
});

export const updateTodoRequest = createTodoRequest.partial().extend({
  status: z.boolean().optional(),
});

export class TodoValidation {
  static readonly CREATE_TODO_REQUEST = createTodoRequest;
  static readonly UPDATE_TODO_REQUEST = updateTodoRequest;
}
