import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private products = [];

  getAll() {
    return this.products;
  }

  getById(id: string) {
    return this.products.find((product) => product.id === id);
  }

  create(productDto: CreateProductDto) {
    this.products.push({
      id: Date.now().toString(),
      ...productDto,
    });
  }
}
