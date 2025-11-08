import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    // ✅ If no Authorization header → skip JWT validation
    if (!authHeader) {
      return true;
    }

    // Otherwise, proceed with normal JWT guard logic
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // ✅ Allow request to continue even if user is not found
    if (err || !user) {
      return null;
    }
    return user;
  }
}
