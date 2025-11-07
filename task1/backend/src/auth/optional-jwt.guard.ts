import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class OptionalJwtAuthGuard extends JwtAuthGuard {
  handleRequest(err, user, info, context: ExecutionContext) {
    // ✅ If there's no user (token missing or invalid) — don't throw
    if (err || !user) {
      return null; // means "not authenticated" but still allowed
    }
    return user; // valid user → continue
  }
}
