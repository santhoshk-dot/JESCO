// src/auth/optional-jwt.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    // ✅ If there’s no Bearer token — skip JWT validation entirely
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return true; // Allow the request to continue
    }

    // Otherwise, run JWT strategy normally
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // ✅ Don’t throw errors — just skip user
    if (err || !user) {
      return null;
    }
    return user;
  }
}
