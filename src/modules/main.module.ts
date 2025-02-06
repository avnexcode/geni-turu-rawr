import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from 'src/filters/error.filter';
import { PrismaService } from 'src/services/prisma.service';
import { SlugService } from 'src/services/slug.service';
import { ValidationService } from 'src/services/validation.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    SlugService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService, SlugService],
})
export class MainModule {}
