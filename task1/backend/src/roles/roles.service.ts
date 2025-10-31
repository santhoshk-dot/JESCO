import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './Schema/role.schmea';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role.name) private RoleModel: Model<Role>){}

    async createRole(role: CreateRoleDto) {
        return this.RoleModel.create(role)
    }

    async getRoleById(roleId: string) {
        return this.RoleModel.findById(roleId)
    }
}
