import { Module } from '@nestjs/common';
import { ProductModule } from './product.module';
import { MainModule } from './main.module';
import { CategoryModule } from './category.module';
import { TodoModule } from './todo.module';

@Module({
  imports: [MainModule, ProductModule, CategoryModule, TodoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
