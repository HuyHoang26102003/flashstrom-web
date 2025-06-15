import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionDto } from './create-promotion.dto';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsArray,
  IsString
} from 'class-validator';
import { DiscountType, PromotionStatus } from '../entities/promotion.entity';

export class UpdatePromotionDto extends PartialType(CreatePromotionDto) {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  start_date?: number;

  @IsOptional()
  @IsNumber()
  end_date?: number;

  @IsOptional()
  avatar?: { url: string; key: string };

  @IsOptional()
  @IsEnum(DiscountType)
  discount_type?: DiscountType;

  @IsOptional()
  @IsNumber()
  discount_value?: number;

  @IsOptional()
  @IsNumber()
  promotion_cost_price?: number;

  @IsOptional()
  @IsNumber()
  minimum_order_value?: number;

  @IsOptional()
  @IsEnum(PromotionStatus)
  status?: PromotionStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  food_category_ids?: string[];

  @IsOptional()
  bogo_details?: {
    buy_quantity: number;
    get_quantity: number;
    max_redemptions?: number;
  };
}
