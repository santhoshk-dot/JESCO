import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // get token from Authorization: Bearer <token>
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'DEFAULT_SECRET', // fallback secret
    });
  }

  // Called automatically by Passport when a valid JWT is provided
  async validate(payload: { sub: string; email: string }) {
    // payload.sub is user._id from AuthService.generateJwt
    const user = await this.authService.validateUser(payload);
    if (!user) {
      // If user not found or deleted
      return null;
    }
    return user; // attaches user to req.user
  }
}
