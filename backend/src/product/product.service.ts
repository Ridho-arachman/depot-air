import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProduct, UpdateProduct } from './interfaces/product.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProducts() {
    const products = await this.prisma.products.findMany({
      select: {
        name: true,
        price: true,
        description: true,
        stock: true,
        path_image: true,
      },
    });
    if (products.length === 0) {
      throw new NotFoundException('Tidak ada produk yang ditemukan');
    } else if (!products) {
      throw new InternalServerErrorException('Gagal mengambil produk');
    }
    return {
      status: 200,
      message: 'Produk berhasil ditemukan',
      data: products,
    };
  }

  async getProductById(sku: string) {
    const product = await this.prisma.products.findUnique({
      where: { sku },
      select: {
        name: true,
        price: true,
        description: true,
        stock: true,
        path_image: true,
      },
    });
    if (product === null) {
      throw new NotFoundException('Produk tidak ditemukan');
    } else if (!product) {
      throw new InternalServerErrorException('Gagal mengambil produk');
    }
    return {
      status: 200,
      message: 'Produk berhasil ditemukan',
      data: product,
    };
  }

  async createProduct(data: CreateProduct) {
    try {
      const product = await this.prisma.products.create({
        data,
        select: {
          name: true,
          price: true,
          description: true,
          stock: true,
          path_image: true,
        },
      });
      return {
        status: 201,
        message: 'Produk berhasil ditambahkan',
        data: product,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Product sudah ada');
        }
      }
      throw new InternalServerErrorException('Gagal menambahkan produk');
    }
  }

  async updateProduct(sku: string, data: UpdateProduct) {
    try {
      const product = await this.prisma.products.update({
        where: { sku },
        data,
        select: {
          name: true,
          price: true,
          description: true,
          stock: true,
          path_image: true,
        },
      });
      return {
        status: 200,
        message: 'Produk berhasil diperbarui',
        data: product,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Produk tidak ditemukan');
        if (error.code === 'P2002')
          throw new BadRequestException('Nama sudah digunakan');
      }
      throw new InternalServerErrorException('Gagal mengupdate produk');
    }
  }

  async deleteProduct(sku: string) {
    try {
      const product = await this.prisma.products.delete({
        where: { sku },
        select: {
          name: true,
          price: true,
          description: true,
          stock: true,
          path_image: true,
        },
      });
      return {
        status: 200,
        message: 'Produk berhasil dihapus',
        data: product,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025')
          throw new NotFoundException('Produk tidak ditemukan');
      }
      throw new InternalServerErrorException('Gagal menghapus produk');
    }
  }
}
