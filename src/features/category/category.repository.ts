import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/models/category.model';
import { QueryParams, QueryResult } from 'src/models/web.model';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CatgeoryRepository {
  constructor(private prismaService: PrismaService) {}
  async findAll(params: QueryParams): Promise<QueryResult<Category>> {
    const { page = 1, limit = 10, search = '' } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaService.category.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          products: true,
        },
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prismaService.category.count({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              slug: {
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
        last_page: lastPage,
        limit,
      },
    };
  }

  async findManyUniqueNames(names: string[]): Promise<Category[]> {
    return this.prismaService.category.findMany({
      where: {
        name: {
          in: names,
        },
      },
    });
  }

  async findUniqueId(id: string): Promise<Category | null> {
    const category = await this.prismaService.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    return category;
  }

  async findUniqueSlug(slug: string): Promise<Category | null> {
    const category = await this.prismaService.category.findUnique({
      where: { slug },
    });

    return category;
  }

  async findUniqueName(name: string): Promise<Category | null> {
    const category = await this.prismaService.category.findUnique({
      where: { name },
    });

    return category;
  }

  async insert(
    request: CreateCategoryRequest & { slug: string },
  ): Promise<Category> {
    const category = await this.prismaService.category.create({
      data: request,
    });

    return category;
  }

  async insertMany(
    request: (CreateCategoryRequest & { slug: string })[],
  ): Promise<number> {
    const categories = await this.prismaService.category.createMany({
      data: request,
      skipDuplicates: true,
    });
    return categories.count;
  }

  async update(
    id: string,
    request: UpdateCategoryRequest & { slug?: string },
  ): Promise<Category> {
    const category = await this.prismaService.category.update({
      where: { id },
      data: request,
    });

    return category;
  }

  async destroy(id: string): Promise<Category> {
    const category = await this.prismaService.category.delete({
      where: { id },
    });

    return category;
  }
}
