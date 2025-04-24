import { HttpStatus, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma, PrismaClient } from 'generated/prisma';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

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
    const totalPage = await this.product.count({where: {available:true}});
    const lastPage = Math.ceil(totalPage / limit);
    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where:{
        available: true
      }
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




  async findOne(id: number) {
    const product = await this.product.findFirst({
      where:{ id, available: true }
    });
    if (!product){
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.BAD_REQUEST
      })


        
    }
    return product;
  }





  async update(id: number, updateProductDto: UpdateProductDto) {

    const {id:_, ... data} = updateProductDto;
    await this.findOne(id);
    return this.product.update({
      where: {id},
      data: updateProductDto,
    })
  }



  async remove(id: number) {
    await this.findOne(id);
    //return this.product.delete({
     // where:{id}
   // });

   const product = await this.product.update({
    where: {id},
    data:{
      available: false
    }
   })
   return product;
  }
}
