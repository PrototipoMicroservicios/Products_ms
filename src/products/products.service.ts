import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';
import { count } from 'console';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductService');


  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto

    });
  }

  //Paginacion de products page & limit
  async findAll(paginationDto: PaginationDto) {
    
    const {page, limit} = paginationDto;
    const totalPage = await this.product.count();
    const lastPage = Math.ceil(totalPage / limit);
    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return {
      data: products,
      meta: {
        page,
        count: products.length,
        lastPage: lastPage,
        totalPage: totalPage,
        
      }
    }
  }




  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
