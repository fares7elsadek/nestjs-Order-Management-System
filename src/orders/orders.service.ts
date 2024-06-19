import { HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OrderStatus } from '@prisma/client';
import { AppError } from 'src/util/AppError';
import Decimal from 'decimal.js';


interface customeRequest extends Request{
  user?:any
}

@Injectable()
export class OrdersService {
  constructor(private readonly databaseservice: DatabaseService){}


  async createOrder(req:customeRequest) {
    const userId = req.user.userId;
    const cart = await this.databaseservice.cart.findUnique({
      where:{
        user_id:userId
      }
    })
    const productCartData = await this.databaseservice.cartProduct.findMany({
      where:{
        cartId:cart.cartId
      }
    })
    const newOrder = await this.databaseservice.order.create({
      data:{
        status:OrderStatus.PENDING,
        user_id:userId
      }
    })
    let productCartObjetArray = productCartData.map(object =>({
        orderId:newOrder.orderId,
        productId:object.productId,
        quantity:object.quantity
    }))
    await this.databaseservice.cartProduct.deleteMany({
      where: {
        cartId: cart.cartId,
      },
    });
    await this.databaseservice.cart.update({
      where: { user_id: userId },
      data: {
        cartProducts: {
          set: [],
        },
        total_price: new Decimal(0),
      },
      include: { cartProducts: true },
    });
    return await this.databaseservice.orderProduct.createMany({
      data:productCartObjetArray
    })
  } 

  async getOrder(orderId:string) {
    return await this.databaseservice.order.findUnique({
      where:{
        orderId
      },
      include:{
        products:true
      }
    })
  }

  async UpdateOrder(orderId:string , status:OrderStatus) {
      return await this.databaseservice.order.update({
        where:{
          orderId
        },
        data:{
          status
        }
      })
  }

  async applyCoupon(coupon: string, req: customeRequest) {
    const coupon_exist = await this.databaseservice.coupon.findFirst({
      where: {
        coupon,
      },
    });
    
    if (!coupon_exist) {
      throw new AppError('Coupon not found', HttpStatus.NOT_FOUND);
    }
  
    const userId = req.user.userId;
    const user = await this.databaseservice.user.findUnique({
      where: {
        userId,
      },
      include: {
        appliedCoupons: true,
      },
    });
  
    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND);
    }
  
    const appliedCoupons = user.appliedCoupons;
    const couponAlreadyApplied = appliedCoupons.some((cop) => cop.coupon === coupon);
  
    if (couponAlreadyApplied) {
      throw new AppError('Coupon has already been applied by you', HttpStatus.BAD_REQUEST);
    }
  
    const applied = await this.databaseservice.coupon.update({
      where: {
        couponId: coupon_exist.couponId,
      },
      data: {
        appliedUsers: {
          connect: { userId },
        },
      },
    });
  
    if (!applied) {
      throw new AppError('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  
    const cart = await this.databaseservice.cart.findUnique({
      where: {
        user_id: userId,
      },
    });
  
    if (!cart) {
      throw new AppError('Cart not found', HttpStatus.NOT_FOUND);
    }
  
    const discount = new Decimal(coupon_exist.discount);
    const cart_price = new Decimal(cart.total_price);
    const newCartPrice = cart_price.minus(discount.times(cart_price).dividedBy(100));
  
    return await this.databaseservice.cart.update({
      where: {
        cartId: cart.cartId,
      },
      data: {
        total_price: newCartPrice.toNumber(),
      },
    });
  }

  
}
