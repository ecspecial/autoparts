import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsNumber, IsPositive } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ description: 'Артикул товара', example: 'AI10091-021-L' })
  @IsString()
  article: string;

  @ApiProperty({ description: 'Количество', example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Название товара', example: 'Стекло фары левое' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Полное название', example: 'AUDI 100 ...' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Марка', example: 'Audi' })
  @IsString()
  marka: string;

  @ApiProperty({ description: 'Модель', example: '100' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Цена на момент добавления', example: 614.64 })
  @IsNumber()
  @IsPositive()
  priceSnapshot: number;
}