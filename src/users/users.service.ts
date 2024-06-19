import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { AppError } from 'src/util/AppError';
import { UpdateCartDto } from './dtos/updateCart.dto';
import { resolvePtr } from 'dns';

interface customeRequest extends Request{
  user?:any
}

@Injectable()
export class UsersService {

  constructor(private readonly databaseservice:DatabaseService){}

 async AddToCart(productId:string,req:customeRequest,quantity:number) {
    const userId = req.user.userId;
    const hasCart = await this.databaseservice.cart.findUnique({
      where:{
        user_id:userId
      }
    })
    const product = await this.databaseservice.product.findUnique({ where: { productId } });
    if(!product)throw new AppError('something wrong has happened', HttpStatus.BAD_REQUEST);
    if(product.stock-quantity <0){
      throw new AppError('not suffient quantity', HttpStatus.BAD_REQUEST);
    }
    const stock: number = product.stock - quantity;
    console.log(quantity);
    await this.databaseservice.product.update({
      where: { productId },
      data: { stock },
    });
    if(hasCart){
          const cartId = hasCart.cartId;
          const found = await this.databaseservice.cartProduct.findUnique({
            where: {
              cartId_productId: {
                cartId,
                productId,
              },
            },
          })
          if(found){
            throw new AppError('product already exsit in the cart', HttpStatus.BAD_REQUEST);
          }
          const cartProduct = await this.databaseservice.cartProduct.create({
            data:{
              cartId:hasCart.cartId,
              productId,
              quantity
            }
          })
          const cartProductId = cartProduct.cartProductId;
          const cart = await this.databaseservice.cart.update({
            where:{user_id:userId},
            data:{
              cartProducts:{
                connect:{cartProductId}
              }
            },
            include:{
              cartProducts:true
            }
          })
          return cart;
    }else{
      const cartProduct = await this.databaseservice.cartProduct.create({
        data:{
          cartId:hasCart.cartId,
          productId,
          quantity
        }
      })
      const cartProductId = cartProduct.cartProductId;
      return this.databaseservice.cart.create({
        data: {
          user_id: userId,
          cartProducts: {
            connect: { cartProductId },
          },
        },
        include: {
          cartProducts: true, 
        },
      });
    }
  }

  async ViewCart(userId:string,req:customeRequest) {
    return await this.databaseservice.cart.findUnique({
      where:{user_id:userId},
      include: {
        cartProducts: true, 
      },
    }); 
  }

  async UpdateCart(updatedCart: UpdateCartDto,req:customeRequest) {
      const productId = updatedCart.productId;
      const quantity = updatedCart.quantity;
      const userId = req.user.userId;
      const product = await this.databaseservice.product.findUnique({ where: { productId } });
      if(!product)throw new AppError('something wrong has happened', HttpStatus.BAD_REQUEST);
      const cart = await this.databaseservice.cart.findUnique({
        where:{
          user_id:userId
        }
      })
      const cartId = cart.cartId;
      const cartP = await this.databaseservice.cartProduct.findUnique({
        where: {
          cartId_productId: {
            cartId,
            productId,
          }
        }
      });
      const qu = cartP.quantity;
      product.stock+=qu;
      if(product.stock-quantity <0){
        throw new AppError('not suffient quantity', HttpStatus.BAD_REQUEST);
      }
      const stock: number = product.stock - quantity;
      await this.databaseservice.product.update({
        where: { productId },
        data: { stock },
      });
      return this.databaseservice.cartProduct.update({
        where: {
          cartId_productId: {
            cartId,
            productId,
          },
        },
        data: {
          quantity,
        },
        include:{
          product:true
        }
      });
  }

  async RemoveFromCart(productId:string,req:customeRequest) {
    const userId = req.user.userId;
    const cart = await this.databaseservice.cart.findUnique({
      where:{
        user_id:userId
      }
    })
    const cartId = cart.cartId;
    
    const process = await this.databaseservice.cartProduct.delete({
      where:{
        cartId_productId:{
          productId,
          cartId
        }
      },
      include:{
        product:true
      }
    })

    const quantity = process.quantity;
    const productStock = process.product.stock;
    await this.databaseservice.product.update({
      where: { productId },
      data: { stock:productStock+quantity},
    });

    return process;

  }

  
}
