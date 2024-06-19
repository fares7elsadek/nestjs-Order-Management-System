import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseservice: DatabaseService){}
  async create(createProductDto: Prisma.ProductCreateInput) {
    return await this.databaseservice.product.create({data:createProductDto});
  }

  async findAll() {
    return await this.databaseservice.product.findMany();
  }

}
