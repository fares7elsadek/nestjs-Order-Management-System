import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateCartDto } from './dtos/updateCart.dto';

@Controller('api')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/cart/add/:id')
  @UseGuards(JwtAuthGuard)
  AddToCart(@Param('id') id: string,@Req() req:Request,@Body('quantity') quantity:number) {
    return this.usersService.AddToCart(id,req,quantity);
  }
  
  @Get('/cart/:userId')
  @UseGuards(JwtAuthGuard)
  ViewCart(@Param('userId') userId: string,@Req() req:Request) {
    return this.usersService.ViewCart(userId,req);
  }

 
  @Put('/cart/update')
  @UseGuards(JwtAuthGuard)
  UpdateCart(@Body() updatedCart: UpdateCartDto,@Req() req:Request) {
    return this.usersService.UpdateCart(updatedCart,req);
  }

  @Delete('/cart/remove/:productId')
  @UseGuards(JwtAuthGuard)
  RemoveFromCart(@Param('productId') id: string,@Req() req:Request) {
    return this.usersService.RemoveFromCart(id,req);
  }


  @Get('/users/:userId/orders')
  @UseGuards(JwtAuthGuard)
  ordersHistory(@Param('userId') userId: string) {
    return this.usersService.ordersHistory(userId);
  }
}
