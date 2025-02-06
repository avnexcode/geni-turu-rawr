export class CreateProductRequest {
  name: string;
  price: string;
  category_id?: string;
}

export class UpdateProductRequest {
  name?: string;
  price?: string;
  category_id?: string;
}
