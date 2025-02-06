import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from 'src/models/category.model';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class CatgeoryRepository {
  constructor(private prismaService: PrismaService) {}
  async findAll(): Promise<Category[]> {
    const categories = await this.prismaService.category.findMany({
      include: {
        products: true,
      },
    });

    return categories;
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
