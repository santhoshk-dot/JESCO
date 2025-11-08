import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Get token from headers
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'DEFAULT_SECRET',
    });
  }

  /**
   * ✅ Called automatically when a valid JWT is provided
   * payload.sub = user._id (from generateJwt)
   */
  async validate(payload: JwtPayload) {
  if (!payload || !payload.sub) {
    // Allow guard to handle missing token instead of throwing
    return null;
  }

  const user = await this.authService.validateUser(payload);
  if (!user) {
    throw new UnauthorizedException('Invalid or expired token');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

}
