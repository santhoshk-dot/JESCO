import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common'
import { OrdersService } from './order.service'
import { CreateOrderDto } from './dto/order.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  
  // Create a new order (Authenticated users only) 
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const userId = req.user?._id || req.user?.id;
    return await this.ordersService.create({ ...createOrderDto, userId });
  }

  // Get all orders for a specific user (Admin use case)  
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return await this.ordersService.findAllByUser(userId);
  }

  // Get all orders for the currently logged-in user
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMyOrders(@Req() req) {
    const userId = req.user?._id || req.user?.id;
    return await this.ordersService.findAllByUser(userId);
  }
}
