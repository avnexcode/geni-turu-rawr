import { Product } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '../../models/product.model';
import { Injectable } from '@nestjs/common';
import { PaginationParams, PaginationResult } from 'src/models/web.model';

@Injectable()
export class ProductRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll(params: PaginationParams): Promise<PaginationResult<Product>> {
    const { page = 1, limit = 10, search = '' } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prismaService.product.findMany({
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
          category: true,
        },
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prismaService.product.count({
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
        lastPage,
        limit,
      },
    };
  }

  async findUniqueId(id: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { id },
    });
    return product;
  }

  async findUniqueSlug(slug: string): Promise<Product | null> {
    const product = await this.prismaService.product.findUnique({
      where: { slug },
    });
    return product;
  }

  async findSimilarSlugs(
    baseSlug: string,
    excludeId: string,
  ): Promise<string[]> {
    const products = await this.prismaService.product.findMany({
      where: {
        AND: [
          {
            slug: {
              startsWith: baseSlug,
            },
          },
          {
            id: {
              not: excludeId,
            },
          },
        ],
      },
      select: {
        slug: true,
      },
    });

    return products.map((product) => product.slug);
  }

  async countSimilarSlug(slug: string): Promise<number> {
    const productsCount = await this.prismaService.product.count({
      where: {
        slug: {
          contains: slug,
        },
      },
    });
    return productsCount;
  }

  async insert(
    request: CreateProductRequest & { slug: string },
  ): Promise<Product> {
    const product = await this.prismaService.product.create({
      data: request,
    });
    return product;
  }

  async insertMany(
    request: (CreateProductRequest & { slug: string })[],
  ): Promise<number> {
    const products = await this.prismaService.product.createMany({
      data: request,
      skipDuplicates: true,
    });
    return products.count;
  }

  async update(
    id: string,
    request: UpdateProductRequest & { slug?: string },
  ): Promise<Product> {
    const product = await this.prismaService.product.update({
      where: { id },
      data: request,
    });
    return product;
  }

  async destroy(id: string): Promise<Product> {
    const product = await this.prismaService.product.delete({ where: { id } });
    return product;
  }
}
