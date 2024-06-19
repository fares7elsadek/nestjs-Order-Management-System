import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { OrderStatus } from '@prisma/client';
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
}
