import { Controller, Get, UseGuards, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //Dashboard stats
  @Get('dashboard')
  async getDashboardStats() {
    return await this.adminService.getDashboardStats();
  }

  // Get all users
  @Get('users')
  async getAllUsers() {
    return await this.adminService.getAllUsers();
  }

  // Delete user
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.adminService.deleteUser(id);
  }
}
