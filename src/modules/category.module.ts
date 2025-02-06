import { Module } from '@nestjs/common';
import { CategoryController } from 'src/features/category/category.controller';
import { CatgeoryRepository } from 'src/features/category/category.repository';
import { CategoryService } from 'src/features/category/category.service';

@Module({
  providers: [CategoryService, CatgeoryRepository],
  controllers: [CategoryController],
})
export class CategoryModule {}
