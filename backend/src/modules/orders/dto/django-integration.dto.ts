import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayNotEmpty,
  IsInt,
  Max,
  Min,
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

  /** Django `Users.id` после проверки пароля — для авто-создания клиента и связки. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  legacy_user_id?: number;

  /** Django `Users.dis` — скидка при создании клиента автоматически. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  legacy_discount?: number;
}

export class DjangoBridgeOrderDetailsDto {
  @IsString()
  bridge_secret: string;

  @IsString()
  partner_login: string;

  @Type(() => Number)
  @IsInt()
  order_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  legacy_user_id?: number;
}
