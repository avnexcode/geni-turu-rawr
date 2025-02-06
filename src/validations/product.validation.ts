import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1).max(50),
  price: z.string().min(1).max(50),
  category_id: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export class ProductValidation {
  static readonly CREATE_PRODUCT_REQUEST = createProductSchema;
  static readonly UPDATE_PRODUCT_REQUEST = updateProductSchema;
}
