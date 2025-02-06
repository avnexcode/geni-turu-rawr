import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
});

export const updateCategorySchema = createCategorySchema.partial();

export class CategoryValidation {
  static readonly CREATE_CATEGORY_REQUEST = createCategorySchema;
  static readonly UPDATE_CATEGORY_REQUEST = updateCategorySchema;
}
