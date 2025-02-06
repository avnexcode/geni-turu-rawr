import { Product } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '../../models/product.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prismaService.product.findMany();
    return products;
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
