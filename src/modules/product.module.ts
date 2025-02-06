import { Module } from '@nestjs/common';
import { ProductService } from '../features/product/product.service';
import { ProductController } from '../features/product/product.controller';
import { ProductRepository } from '../features/product/product.repository';

@Module({
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
