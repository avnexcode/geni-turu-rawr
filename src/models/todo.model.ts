export class CreateTodoRequest {
  text: string;
}

export class UpdateTodoRequest {
  text?: string;
  status?: boolean;
}
