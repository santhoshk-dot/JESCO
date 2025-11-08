import {
  Controller,
  Get,
  UseGuards,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 📊 Get Dashboard Analytics (Total Users, Orders, Products)
   * For Admin Dashboard Home
   */
  @Get('analytics')
  async getAnalytics() {
    const stats = await this.adminService.getDashboardStats();
    return {
      message: '✅ Analytics fetched successfully',
      ...stats,
    };
  }

  /**
   * 👥 Get All Users (Admin)
   */
  @Get('users')
  async getAllUsers() {
    const users = await this.adminService.getAllUsers();
    return {
      total: users.length,
      users,
    };
  }

  /**
   * ❌ Delete User by ID (Admin)
   */
  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    const result = await this.adminService.deleteUser(id);
    return {
      message: '🗑️ User deleted successfully',
      result,
    };
  }
}
