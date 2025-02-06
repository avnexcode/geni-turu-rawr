import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseMessageService {
  getAll(model: string): string {
    return `Successfully retrieved all ${model.toLowerCase()} data`;
  }

  getById(model: string): string {
    return `Successfully retrieved ${model.toLowerCase()} data`;
  }

  post(model: string): string {
    return `Successfully created new ${model.toLowerCase()}`;
  }

  put(model: string): string {
    return `Successfully updated ${model.toLowerCase()} data`;
  }

  patch(model: string): string {
    return `Successfully updated ${model.toLowerCase()} data partially`;
  }

  delete(model: string): string {
    return `Successfully deleted ${model.toLowerCase()} data`;
  }

  custom(action: string, model: string): string {
    return `Successfully ${action.toLowerCase()} ${model.toLowerCase()}`;
  }

  notFound(model: string): string {
    return `${model} data not found`;
  }

  invalidData(model: string): string {
    return `Invalid ${model.toLowerCase()} data`;
  }

  alreadyExists(model: string, field: string): string {
    return `${model} with this ${field} already exists`;
  }
}
