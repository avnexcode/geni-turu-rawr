import { Module } from '@nestjs/common';
import { ProductModule } from './product.module';
import { MainModule } from './main.module';
import { CategoryModule } from './category.module';

@Module({
  imports: [MainModule, ProductModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
