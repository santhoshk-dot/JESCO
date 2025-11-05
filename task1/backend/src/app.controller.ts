import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticationGuard } from './guards/authentication.guard';
import { Permissions } from './decorators/roles.decorator';
import { Resource } from './roles/enums/resource.enum';
import { Action } from './roles/enums/action.enum';
import { AuthorizationGuard } from './guards/authorization.guard';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Permissions([
    { resource: Resource.products, actions: [Action.read, Action.create] },
    { resource: Resource.settings, actions: [Action.read] },
  ])

@Controller('/products')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  someProtectedRoute(@Req() req)  {
    return { message: 'Accessed Resource', userId: req.userId}
  }

  
}
