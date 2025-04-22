import { Transform } from 'class-transformer';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ProductUpdateDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsNotEmpty({ message: 'Description cannot be empty or just spaces' })
  name?: string;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) => value?.trim())
  @IsNotEmpty({ message: 'Description cannot be empty or just spaces' })
  description?: string;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsUrl()
  path_image?: string;
}
