import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DjangoBridgeOrderLineDto {
  @IsString()
  article: string;

  /** Одно из полей quantity или qty (часто строка из JSON). Нормализуется в сервисе. */
  @IsOptional()
  quantity?: unknown;

  @IsOptional()
  qty?: unknown;

  @IsOptional()
  @IsString()
  nc_ref?: string;

  @IsOptional()
  @IsString()
  nc_coment?: string;
}

export class DjangoBridgeCreateOrderDto {
  @IsString()
  bridge_secret: string;

  @IsString()
  partner_login: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DjangoBridgeOrderLineDto)
  order: DjangoBridgeOrderLineDto[];

  /** Передаётся из legacy Django; сохранение в заказ пока не дублируем. */
  @IsOptional()
  delivery?: number | string;
}

export class DjangoBridgeOrderDetailsDto {
  @IsString()
  bridge_secret: string;

  @IsString()
  partner_login: string;

  @Type(() => Number)
  @IsInt()
  order_id: number;
}
