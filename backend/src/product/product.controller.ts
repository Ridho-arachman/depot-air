import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly product: ProductService) {}

  @Get()
  @HttpCode(200)
  findAll() {
    return this.product.getAllProducts();
  }

  @Get('/:sku')
  @HttpCode(200)
  findOne(@Param('sku') sku: string) {
    return this.product.getProductById(sku);
  }

  @Post()
  @HttpCode(200)
  createProduct(@Body() dto: ProductCreateDto) {
    return this.product.createProduct(dto);
  }

  @Patch('/:sku')
  @HttpCode(200)
  updateProduct(@Body() dto: ProductUpdateDto, @Param('sku') sku: string) {
    return this.product.updateProduct(sku, dto);
  }

  @Delete('/:sku')
  @HttpCode(200)
  deleteProduct(@Param('sku') sku: string) {
    return this.product.deleteProduct(sku);
  }
}
