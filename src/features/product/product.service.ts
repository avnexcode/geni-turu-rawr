import { HttpException, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from '@prisma/client';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '../../models/product.model';
import { ValidationService } from 'src/services/validation.service';
import { ProductValidation } from '../../validations/product.validation';
import { SlugService } from 'src/services/slug.service';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private validationService: ValidationService,
    private slugService: SlugService,
  ) {}

  async getAll(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return products;
  }

  async getById(id: string): Promise<Product> {
    const product = await this.productRepository.findUniqueId(id);
    if (!product) {
      throw new HttpException(`Product with id : ${id} not found`, 404);
    }
    return product;
  }

  async getBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findUniqueSlug(slug);
    if (!product) {
      throw new HttpException(`Product with slug : ${slug} not found`, 404);
    }
    return product;
  }

  async create(request: CreateProductRequest): Promise<Product> {
    const validatedRequest = this.validationService.validate(
      ProductValidation.CREATE_PRODUCT_REQUEST,
      request,
    );

    let slug = this.slugService.generateSlug(validatedRequest.name);
    const slugExists = await this.productRepository.countSimilarSlug(slug);
    const slugIndex = slugExists + 1;

    if (slugExists !== 0) {
      slug = slug + `-${slugIndex}`;
    }

    const product = await this.productRepository.insert({
      ...validatedRequest,
      slug,
    });
    return product;
  }

  async update(id: string, request: UpdateProductRequest): Promise<Product> {
    await this.getById(id);

    const validatedRequest = this.validationService.validate(
      ProductValidation.UPDATE_PRODUCT_REQUEST,
      request,
    );

    if (!validatedRequest.name) {
      const product = await this.productRepository.update(id, validatedRequest);
      return product;
    }

    const slug = await this.slugService.generateUniqueSlug(
      validatedRequest.name,
      this.productRepository,
      id,
    );

    const product = await this.productRepository.update(id, {
      ...validatedRequest,
      slug,
    });

    return product;
  }

  async delete(id: string): Promise<{ id: string }> {
    await this.getById(id);
    await this.productRepository.destroy(id);
    return { id };
  }
}
