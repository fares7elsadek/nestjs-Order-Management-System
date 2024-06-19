import { Controller, Get, Post, Param, Req, UseGuards, Put, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OrderStatus } from '@prisma/client';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(@Req() req:Request) {
    return this.ordersService.createOrder(req);
  }

  @Post('apply-coupon')
  @UseGuards(JwtAuthGuard)
  applyCoupon(@Body('coupon') coupon:string,@Req() req:Request) {
    return this.ordersService.applyCoupon(coupon,req);
  }

  @Get(":orderId")
  @UseGuards(JwtAuthGuard)
  getOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrder(orderId);
  }

  @Put(':orderId/:status')
  @UseGuards(JwtAuthGuard)
  UpdateOrder(@Param('orderId') orderId: string,@Param('status') status: OrderStatus) {
    return this.ordersService.UpdateOrder(orderId,status);
  }


 
}
