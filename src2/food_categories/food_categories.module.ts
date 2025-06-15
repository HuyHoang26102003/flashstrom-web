import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodCategoriesService } from './food_categories.service';
import { FoodCategoriesController } from './food_categories.controller';
import { FoodCategory } from './entities/food_category.entity';
import { FoodCategoriesRepository } from './food_categories.repository';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([FoodCategory])],
  controllers: [FoodCategoriesController],
  providers: [FoodCategoriesService, FoodCategoriesRepository, RedisService],
  exports: [FoodCategoriesService]
})
export class FoodCategoriesModule {}
