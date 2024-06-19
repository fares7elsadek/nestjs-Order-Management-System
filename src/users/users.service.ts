import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { AppError } from 'src/util/AppError';
import { UpdateCartDto } from './dtos/updateCart.dto';
import Decimal from 'decimal.js';

interface customeRequest extends Request{
  user?:any
}

@Injectable()
export class UsersService {

  constructor(private readonly databaseservice:DatabaseService){}

  async AddToCart(productId: string, req: customeRequest, quantity: number) {
    const userId = req.user.userId;

   
    const product = await this.databaseservice.product.findUnique({ where: { productId } });
    if (!product) throw new AppError('Product not found', HttpStatus.NOT_FOUND);

    
    if (product.stock < quantity) {
        throw new AppError('Insufficient stock', HttpStatus.BAD_REQUEST);
    }

    
    const newStock = product.stock - quantity;
    await this.databaseservice.product.update({
        where: { productId },
        data: { stock: newStock },
    });

    
    const hasCart = await this.databaseservice.cart.findUnique({
        where: { user_id: userId },
        include: { cartProducts: true },
    });

    const productPrice = new Decimal(product.price);
    
    if (hasCart) {
        
        const found = hasCart.cartProducts.some(cartProduct => cartProduct.productId === productId);
        if (found) {
            throw new AppError('Product already exists in the cart', HttpStatus.BAD_REQUEST);
        }

        
        const cartTotalPrice = new Decimal(hasCart.total_price);
        const total_price = cartTotalPrice.plus(productPrice.times(quantity));
        
       
        const cartProduct = await this.databaseservice.cartProduct.create({
            data: {
                cartId: hasCart.cartId,
                productId,
                quantity,
            },
        });

        const updatedCart = await this.databaseservice.cart.update({
            where: { user_id: userId },
            data: {
                cartProducts: {
                    connect: { cartProductId: cartProduct.cartProductId },
                },
                total_price: total_price.toNumber(),
            },
            include: { cartProducts: true },
        });

        return updatedCart;
    } else {
        
        const total_price = productPrice.times(quantity);
        const newCart = await this.databaseservice.cart.create({
            data: {
                user_id: userId,
                total_price: total_price.toNumber(),
                cartProducts: {
                    create: [{
                        productId,
                        quantity,
                    }],
                },
            },
            include: { cartProducts: true },
        });

        return newCart;
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
      if(qu-quantity <0){
        const new_quantity = quantity - qu;
        const quantityDecimal = new Decimal(new_quantity);
        const cart_price = new Decimal(cart.total_price);
        const productPrice = new Decimal(product.price);
        const total_price = cart_price.plus(quantityDecimal.times(productPrice));
        await this.databaseservice.cart.update({
          where:{
            cartId:cart.cartId
          },
          data:{
            total_price:total_price.toNumber()
          }
        })
      }else{
        const new_quantity = qu - quantity;
        const quantityDecimal = new Decimal(new_quantity);
        const cart_price = new Decimal(cart.total_price);
        const productPrice = new Decimal(product.price);
        const total_price = cart_price.minus(quantityDecimal.times(productPrice));
        await this.databaseservice.cart.update({
          where:{
            cartId:cart.cartId
          },
          data:{
            total_price:total_price.toNumber()
          }
        })
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

    const quantityDecimal = new Decimal(quantity);
    const ProductPrice = new Decimal(process.product.price);
    const total_price = new Decimal(cart.total_price);
    const new_price = total_price.minus(ProductPrice.times(quantityDecimal));

    await this.databaseservice.cart.update({
      where:{
        cartId:cart.cartId
      },
      data:{
        total_price:new_price.toNumber()
      }
    })
    await this.databaseservice.product.update({
      where: { productId },
      data: { stock:productStock+quantity},
    });

    return process;

  }


  async ordersHistory(userId:string){
    return await this.databaseservice.order.findMany({
      where:{
        user_id:userId
      },
      include:{
        products:true
      }
    })
  }

  
}
