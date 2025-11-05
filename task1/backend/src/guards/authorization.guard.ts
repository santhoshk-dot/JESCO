import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "src/auth/auth.service";
import { Permission } from "src/roles/dto/role.dto";

@Injectable()
export class AuthorizationGuard implements CanActivate{
    constructor(
        private reflector: Reflector,
        private authService: AuthService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {



        const request = context.switchToHttp().getRequest()

        if ( !request.userId) {
            throw new UnauthorizedException('User Id not found')
        }



        // try {
        //     const userPermissions = await this.authService.getUserPermissions(
        //       request.userId
        //     )

        //     for (const routePermission of routePermissions) {
        //         const userPermission = userPermissions.find(
        //             (perm) => perm.resource === routePermission.resource
        //         )

        //         if(!userPermission) throw new ForbiddenException()

        //         const allActionsAvailable = routePermission.actions.every(
        //             (requiredAction) => userPermission.actions.includes(requiredAction),
        //         )    
        //         if (!allActionsAvailable) throw new ForbiddenException()
                
        //     }
            
        // } catch (e) {
        //     throw new ForbiddenException()
            
        // }

        return true
    }
}