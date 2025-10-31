import { SetMetadata } from "@nestjs/common";
import { Permission } from "src/roles/dto/role.dto";

export const PERMISSIONS_KEY = 'permisssions'

export const Permissions = (permissions: Permission[]) => 
    SetMetadata(PERMISSIONS_KEY, permissions)