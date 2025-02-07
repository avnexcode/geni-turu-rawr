import { HttpException, Injectable } from '@nestjs/common';
import { CatgeoryRepository } from './category.repository';
import { ValidationService } from 'src/services/validation.service';
import { Category } from '@prisma/client';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/models/category.model';
import { CategoryValidation } from 'src/validations/category.validation';
import { SlugService } from 'src/services/slug.service';
import { QueryParams, QueryResult } from 'src/models/web.model';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CatgeoryRepository,
    private validationService: ValidationService,
    private slugService: SlugService,
  ) {}

  async getAll(params: QueryParams): Promise<QueryResult<Category>> {
    const categories = await this.categoryRepository.findAll(params);

    return categories;
  }

  async getById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findUniqueId(id);

    if (!category) {
      throw new HttpException(`Category with id : ${id} not found`, 404);
    }

    return category;
  }

  async getBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findUniqueSlug(slug);

    if (!category) {
      throw new HttpException(`Category with slug : ${slug} not found`, 404);
    }

    return category;
  }

  async create(request: CreateCategoryRequest): Promise<Category> {
    const validatedRequest = this.validationService.validate(
      CategoryValidation.CREATE_CATEGORY_REQUEST,
      request,
    );

    const categoryExists = await this.categoryRepository.findUniqueName(
      validatedRequest.name,
    );

    if (categoryExists) {
      throw new HttpException('Category already exists', 400);
    }

    const slug = this.slugService.generateSlug(validatedRequest.name);

    const category = await this.categoryRepository.insert({
      ...validatedRequest,
      slug,
    });

    return category;
  }

  async createMany(requests: CreateCategoryRequest[]): Promise<number> {
    const validatedRequests = requests.map((request) =>
      this.validationService.validate(
        CategoryValidation.CREATE_CATEGORY_REQUEST,
        request,
      ),
    );

    const names = validatedRequests.map((request) => request.name);
    if (new Set(names).size !== names.length) {
      throw new HttpException('Duplicate category names in request', 400);
    }

    const existingCategories =
      await this.categoryRepository.findManyUniqueNames(names);
    if (existingCategories.length > 0) {
      throw new HttpException(
        `Categories already exist: ${existingCategories.map((c) => c.name).join(', ')}`,
        400,
      );
    }

    const categoriesData = validatedRequests.map((request) => ({
      ...request,
      slug: this.slugService.generateSlug(request.name),
    }));

    const categoriesCreatedCount =
      await this.categoryRepository.insertMany(categoriesData);

    return categoriesCreatedCount;
  }

  async update(id: string, request: UpdateCategoryRequest): Promise<Category> {
    await this.getById(id);

    const validatedRequest = this.validationService.validate(
      CategoryValidation.UPDATE_CATEGORY_REQUEST,
      request,
    );

    const categoryExists = await this.categoryRepository.findUniqueName(
      validatedRequest.name!,
    );

    if (categoryExists && categoryExists?.id !== id) {
      throw new HttpException('Category already exists', 400);
    }

    const category = await this.categoryRepository.update(id, validatedRequest);

    return category;
  }

  async delete(id: string): Promise<{ id: string }> {
    await this.getById(id);

    await this.categoryRepository.destroy(id);

    return { id };
  }
}
