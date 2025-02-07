import { Module } from '@nestjs/common';
import { ProductModule } from './product.module';
import { MainModule } from './main.module';
import { CategoryModule } from './category.module';
import { TodoModule } from './todo.module';
import { AppController } from 'src/features/app/app.controller';

@Module({
  imports: [MainModule, ProductModule, CategoryModule, TodoModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
